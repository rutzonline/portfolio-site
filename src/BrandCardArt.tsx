export function BrandNotesArt({ titles }: { titles: string[] }) {
  return <div className="brand-art-slot">
    <div className="brand-notes-art">
      <img width={352} height={235} src="/brandn.png" alt="" aria-hidden="true" draggable={false} />
      <ol className="brand-paper-titles">
        {titles.map((title, index) => <li key={title}>
          <span aria-hidden="true" className="paper-note-number">0{index + 1}</span>
          {title.replace("recommendation", "recom\u00admendation")}
        </li>)}
      </ol>
    </div>
  </div>
}

export function BrandCoffeeArt({ items }: { items: [string, string][] }) {
  return <div className="brand-art-slot">
    <div className="brand-coffee-art">
      <img width={265} height={265} src="/brandw.png" alt="" aria-hidden="true" draggable={false} />
      <dl>
        {items.map(([label, value], index) => <div className={`coffee-detail coffee-detail-${index}`} key={label}>
          <dt>{label}</dt>
          <dd className={index === 3 ? "tabular-nums" : undefined}>{value}</dd>
        </div>)}
      </dl>
    </div>
  </div>
}
