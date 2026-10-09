import { useEffect, useRef } from "react"

export default function ImagePreview({ src, alt, onClose }: {
  src: string
  alt: string
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const bodyOverflow = document.body.style.overflow
    const article = dialog.closest<HTMLElement>("[data-about-content], .page-article")
    const articleOverflow = article?.style.overflowY ?? ""
    document.body.style.overflow = "hidden"
    if (article) article.style.overflowY = "hidden"
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = bodyOverflow
      if (article) article.style.overflowY = articleOverflow
    }
  }, [])

  return (
    <dialog ref={dialogRef} aria-label={alt} onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
      }}
      className="m-auto w-[min(92vw,960px)] max-w-none rounded-xl border-0 bg-[#FAF9F6] p-4 text-[#1A1A1A] shadow-2xl backdrop:bg-black/80">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm leading-snug">{alt}</p>
        <button type="button" onClick={onClose} aria-label="Close expanded image"
          className="flex size-10 shrink-0 items-center justify-center rounded-md text-2xl hover:bg-black/10">
          ×
        </button>
      </div>
      <img src={src} alt={alt} className="mx-auto max-h-[75svh] max-w-full object-contain" />
    </dialog>
  )
}
