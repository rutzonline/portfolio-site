import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'

const directory = mkdtempSync(join(tmpdir(), 'consumption-tests-'))
for (const file of ['lib/supabase', 'consumption/dates', 'consumption/data']) {
  const target = join(directory, `${file}.mjs`)
  mkdirSync(join(directory, file.split('/')[0]), { recursive: true })
  const source = readFileSync(new URL(`../src/${file}.ts`, import.meta.url), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replaceAll('"../lib/supabase"', '"../lib/supabase.mjs"').replaceAll('"./dates"', '"./dates.mjs"')
  writeFileSync(target, output)
}
const datesUrl = pathToFileURL(join(directory, 'consumption/dates.mjs')).href
const dates = await import(datesUrl)
const { normalizeRows, safeUrl, loadEntries } = await import(pathToFileURL(join(directory, 'consumption/data.mjs')).href)
const originalFetch = global.fetch
test.after(() => { global.fetch = originalFetch; rmSync(directory, { recursive: true, force: true }) })
const row = (overrides = {}) => ({ id: 'id', consumed_on: '2024-02-29', title: 'Test entry', url: 'https://example.org', category: 'article', platform: null, sort_order: 0, published: true, ...overrides })

test('civil-date arithmetic handles leap years, month boundaries and Sunday weeks', () => {
  assert.equal(dates.addDays('2024-02-28', 1), '2024-02-29')
  assert.equal(dates.addDays('2024-02-29', 1), '2024-03-01')
  assert.equal(dates.addMonths('2024-01-31', 1), '2024-02-01')
  assert.equal(dates.addMonths('2024-12-31', 1), '2025-01-01')
  assert.equal(dates.weekStart('2025-01-01'), '2024-12-29')
  assert.equal(dates.monthDays('2024-02-01').filter(Boolean).length, 29)
  assert.equal(dates.monthDays('2025-02-01').filter(Boolean).length, 28)
  assert.equal(dates.validDate('2025-02-29'), false)
})

test('date labels and keys do not shift across user timezones or DST', () => {
  for (const TZ of ['America/Los_Angeles', 'Asia/Kolkata', 'Pacific/Kiritimati']) {
    const script = `import {labelDate,addDays} from ${JSON.stringify(datesUrl)}; console.log(labelDate('2026-03-08')); console.log(addDays('2026-03-08',1))`
    const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, TZ }, encoding: 'utf8' })
    assert.equal(output, 'Sunday, March 8, 2026\n2026-03-09\n')
  }
})

test('only explicitly published rows render, with date-desc and within-date sort_order', () => {
  const entries = normalizeRows([row({ id: 'late', sort_order: 9 }), row({ id: 'first', sort_order: 1 }), row({ id: 'new', consumed_on: '2024-03-01' }), row({ id: 'null', published: null }), row({ id: 'private', published: false })])
  assert.deepEqual(entries.map((entry) => entry.id), ['new', 'first', 'late'])
  assert.equal(safeUrl('javascript:alert(1)'), null)
  assert.equal(safeUrl('data:text/html,anything'), null)
  assert.equal(safeUrl('x.com/person/status/123'), 'https://x.com/person/status/123')
  assert.equal(normalizeRows([row({ platform: '   ' })])[0].platform, null)
})

test('paginates all published rows and uses stable ordering, including server-capped pages', async () => {
  let calls = 0
  global.fetch = async (url, options) => {
    const query = new URL(url).searchParams
    assert.equal(query.get('published'), 'is.true')
    assert.equal(query.get('order'), 'consumed_on.desc,sort_order.asc,id.asc')
    assert.ok(options.signal)
    assert.equal(options.method, undefined) // fetch default is GET, no mutations
    const offset = Number(query.get('offset'))
    calls++
    const data = Array.from({ length: Math.min(50, 251 - offset) }, (_, n) => row({ id: String(n + offset).padStart(3, '0') }))
    return Response.json(data, { headers: { 'Content-Range': `${offset}-${offset + data.length - 1}/251` } })
  }
  assert.equal((await loadEntries(new AbortController().signal)).length, 251)
  assert.equal(calls, 6)
})

test('existing schema without sort_order works; network errors are not turned into sample data', async () => {
  let calls = 0
  global.fetch = async (url) => {
    calls++
    if (calls === 1) return Response.json({ code: '42703' }, { status: 400 })
    assert.ok(!new URL(url).searchParams.get('select').includes('sort_order'))
    return Response.json([row({ sort_order: undefined })], { headers: { 'Content-Range': '0-0/1' } })
  }
  assert.equal((await loadEntries(new AbortController().signal))[0].sort_order, 0)
  global.fetch = async () => Response.json({ message: 'failed' }, { status: 503 })
  await assert.rejects(loadEntries(new AbortController().signal))
})
