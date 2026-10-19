import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/navigation.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
  .replace('from "react"', `from "${import.meta.resolve('react')}"`)
const { normalizeLegacyURL, navigate, slugify } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const originalWindow = globalThis.window
const changes = []
function at(path) {
  globalThis.window = {
    location: new URL(path, 'https://www.rutzonline.com'),
    history: {
      state: null,
      replaceState(state, _, url) { this.state = state; window.location = new URL(url, window.location) },
      pushState(state, _, url) { this.state = state; changes.push(url); window.location = new URL(url, window.location) },
    },
    dispatchEvent(event) { changes.push(event.type) },
  }
  changes.length = 0
}
test.after(() => { globalThis.window = originalWindow })

test('old mode hashes migrate to clean paths without dropping mode, detail or query', () => {
  for (const mode of ['growth', 'brand']) {
    for (const route of ['', '/about', '/notes/the-tyranny-of-optimal', '/experience/hopstack', '/what-im-up-to/photos']) {
      at(`/?source=shared#${mode}${route}`)
      normalizeLegacyURL()
      assert.equal(window.location.pathname, `/${mode}${route}`)
      assert.equal(window.location.hash, '')
      assert.equal(window.location.search, '?source=shared')
      assert.equal(changes.length, 0)
    }
  }
})

test('legacy shortcut links resolve to the intended pages and case details', () => {
  const routes = {
    cursor: '/growth/case-studies/cursor', wispr: '/growth/case-studies/wispr-flow',
    revolut: '/growth/case-studies/revolut', heyclicky: '/growth/case-studies/heyclicky',
    consumption: '/growth/what-im-up-to', writing: '/growth/notes',
  }
  for (const [legacy, path] of Object.entries(routes)) {
    at(`/${legacy}/`); normalizeLegacyURL()
    assert.equal(window.location.pathname, path)
  }
})

test('canonical links and in-page section anchors remain intact', () => {
  for (const path of ['/brand/moodboard', '/growth/case-studies/cursor', '/growth/about#introduction']) {
    at(path); normalizeLegacyURL()
    assert.equal(window.location.pathname + window.location.hash, path)
  }
  at('/brand/notes/?from=home#section')
  normalizeLegacyURL()
  assert.equal(window.location.pathname + window.location.search + window.location.hash, '/brand/notes?from=home#section')
})

test('navigation records its parent path and emits an update without a hash', () => {
  at('/brand/experience')
  navigate('/brand/experience/hopstack')
  assert.equal(window.history.state.portfolioFrom, '/brand/experience')
  assert.deepEqual(changes, ['/brand/experience/hopstack', 'portfolio:navigate'])
  navigate('/brand/experience', true)
  assert.equal(window.location.pathname, '/brand/experience')
  assert.equal(window.location.hash, '')
  assert.equal(slugify('Wispr Flow'), 'wispr-flow')
  assert.equal(slugify('Why every AI startup sounds the same'), 'why-every-ai-startup-sounds-the-same')
})

test('the existing deployment fallback covers clean routes and preserves asset/API handling', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  const rule = config.rewrites.at(-1)
  const pattern = new RegExp(`^${rule.source}$`)
  assert.equal(rule.destination, '/index.html')
  for (const path of ['/growth', '/brand', '/growth/case-studies/wispr-flow', '/brand/experience/hopstack', '/brand/notes/the-tyranny-of-optimal']) {
    assert.match(path, pattern)
  }
  for (const path of ['/assets/app.js', '/work-samples/sample.webp', '/imports/image.png', '/media/photo.webp', '/tool-logos/replit.svg', '/videos/introduction.mp4', '/api/example']) {
    assert.doesNotMatch(path, pattern)
  }
})
