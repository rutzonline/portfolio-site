import MusicTrail from "@/MusicTrail"

export default function UpToExtras({ onOpenPhotos, photosOpen }: { onOpenPhotos: (element: HTMLButtonElement) => void; photosOpen: boolean }) {
  return <section aria-label="Music and photos" className="grid min-h-[36vh] grid-cols-2 items-start gap-5 pt-16 sm:gap-12 lg:pt-20">
    <MusicTrail suspended={photosOpen} />
    <div className="flex flex-col items-center">
      <button type="button" aria-label="Open photo gallery" aria-haspopup="dialog" onClick={(event) => onOpenPhotos(event.currentTarget)}
        className="upto-icon-button flex flex-col items-center gap-3 rounded-xl p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d2e4b]">
        <img src="/photo-folder.png" alt="" className={`h-24 w-24 object-contain ${photosOpen ? "opacity-0" : ""}`} />
        <span className="text-sm">photos</span>
      </button>
      <p className="mt-2 text-center text-xs text-[#1A1A1A]/55">little things, lately</p>
    </div>
  </section>
}
