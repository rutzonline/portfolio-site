import CharmPicker from "@/CharmPicker"

export default function UpToExtras({ onOpenPhotos, photosOpen }: { onOpenPhotos: (element: HTMLButtonElement) => void; photosOpen: boolean }) {
  return <section aria-label="Charms and photos" className="grid min-h-[36vh] grid-cols-1 items-start gap-8 pt-16 lg:grid-cols-[minmax(0,1fr)_108px] lg:gap-12 lg:pt-20">
    <CharmPicker />
    <div className="flex flex-col items-center justify-self-end">
      <button type="button" aria-label="Open photo gallery" aria-haspopup="dialog" onClick={(event) => onOpenPhotos(event.currentTarget)}
        className="upto-icon-button flex items-center justify-center rounded-xl p-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d2e4b]">
        <img src="/photo-folder.png" alt="" className={`h-24 w-24 object-contain ${photosOpen ? "opacity-0" : ""}`} />
      </button>
    </div>
  </section>
}
