import { useEffect, useRef, useState } from "react"
import { getPhotos } from "@/PhotoSlideshow"

export default function PhotoGallery({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [status, setStatus] = useState("loading photos…")
  const [attempt, setAttempt] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = (direction: number) => setCurrent((index) => (index + direction + photos.length) % photos.length)

  useEffect(() => {
    const element = dialog.current
    const opener = document.activeElement
    element?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      element?.close()
      document.body.style.overflow = previous
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
    }
  }, [])
  useEffect(() => {
    let cancelled = false
    setStatus("loading photos…")
    getPhotos().then((urls) => {
      if (cancelled) return
      setPhotos(urls)
      setStatus(urls.length ? "" : "no photos to show yet.")
    }).catch(() => { if (!cancelled) setStatus("couldn’t load the photos. please try again.") })
    return () => { cancelled = true }
  }, [attempt])
  useEffect(() => {
    if (!playing || photos.length < 2) return
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % photos.length), 15000)
    return () => window.clearInterval(timer)
  }, [playing, photos.length])
  return (
    <dialog ref={dialog} aria-labelledby="photo-gallery-title" onCancel={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      onKeyDown={(event) => {
        if (!photos.length) return
        if (event.key === "ArrowLeft") { event.preventDefault(); step(-1) }
        if (event.key === "ArrowRight") { event.preventDefault(); step(1) }
      }}
      className="m-auto w-[calc(100%-24px)] max-w-3xl max-h-[calc(100svh-24px)] overflow-y-auto rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-4 text-[#1A1A1A] backdrop:bg-black/65">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="photo-gallery-title" className="text-xl font-semibold">life, in photos</h2>
        <button type="button" onClick={onClose} className="min-h-11 rounded-md border border-[#E5E1DA] px-3">close</button>
      </div>
      {status && <div role="status" className="py-8">
        <p>{status}</p>
        {status.startsWith("couldn’t") && <button type="button" onClick={() => setAttempt((n) => n + 1)} className="back-btn mt-3">try again</button>}
      </div>}
      {photos.length > 0 && <>
        <img src={photos[current]} alt={`Photo ${current + 1} from Rutuja’s collection`}
          className="h-[48svh] w-full rounded-md bg-black/5 object-contain" />
        <div className="my-3 flex items-center justify-between gap-2">
          <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="min-h-11 rounded-md border border-[#E5E1DA] px-3">←</button>
          <span aria-live="polite" className="text-sm">{current + 1} / {photos.length}</span>
          <button type="button" onClick={() => setPlaying((p) => !p)} className="min-h-11 rounded-md border border-[#E5E1DA] px-3">{playing ? "pause" : "play"}</button>
          <button type="button" aria-label="Next photo" onClick={() => step(1)} className="min-h-11 rounded-md border border-[#E5E1DA] px-3">→</button>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {photos.map((src, index) => <button key={src} type="button" aria-label={`View photo ${index + 1}`} aria-pressed={current === index}
            onClick={() => { setCurrent(index); setPlaying(false) }}
            className={`overflow-hidden rounded-md border-2 ${current === index ? "border-[#1b3e8c]" : "border-transparent"}`}>
            <img src={src} alt="" loading="lazy" className="aspect-square w-full object-cover" />
          </button>)}
        </div>
      </>}
    </dialog>
  )
}
