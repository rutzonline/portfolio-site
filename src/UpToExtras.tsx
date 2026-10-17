import CharmPicker from "@/CharmPicker"

export default function UpToExtras({ onOpenPhotos, photosOpen }: { onOpenPhotos: (element: HTMLButtonElement) => void; photosOpen: boolean }) {
  return <section aria-label="Charms and photos" className="upto-extras">
    <CharmPicker photos={
      <button type="button" aria-label="Open photo gallery" aria-haspopup="dialog" onClick={(event) => onOpenPhotos(event.currentTarget)}
        className="upto-icon-button hidden lg:flex items-center justify-center rounded-xl p-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d2e4b]">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/camlab-cam6.png" />
          <img src="/photo-folder.png" alt="" className={`h-24 w-24 object-contain ${photosOpen ? "opacity-0" : ""}`} />
        </picture>
      </button>
    } />
  </section>
}
