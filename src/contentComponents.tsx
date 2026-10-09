export function Rows({ items }: { items: [string, string][] }) {
  return (
    <dl className="divide-y divide-[#1A1A1A]/15">
      {items.map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
        >
          <dt className="text-[#1A1A1A]/60">{k}</dt>
          <dd className="text-right">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

const placeholderImg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#F0EEEA"/><text x="800" y="450" font-family="Inter,sans-serif" font-size="32" fill="#8A8A8A" text-anchor="middle">image placeholder</text></svg>',
  )

export function ImageSlot({
  alt,
  src = placeholderImg,
  className = "",
}: {
  alt: string
  src?: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`w-full rounded-md border border-[#E5E1DA] bg-[#F0EEEA] object-cover ${className}`}
    />
  )
}
