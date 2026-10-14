import { useEffect, useRef } from "react"

export default function ImagePreview({ src, alt, onClose }: {
  src: string
  alt: string
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const opener = useRef(document.activeElement)
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
      if (opener.current instanceof HTMLElement) opener.current.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog ref={dialogRef} aria-label={alt}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClose={(event) => { if (!event.currentTarget.open) onClose() }}
      onClick={onClose}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none cursor-zoom-out border-0 bg-transparent p-3 outline-none backdrop:bg-black/80"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClose() }
      }}>
      <img src={src} alt={alt} className="h-full w-full object-contain" />
    </dialog>
  )
}
