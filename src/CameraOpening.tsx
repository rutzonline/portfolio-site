import { useEffect, useRef, type RefObject } from "react"

type Rect = { x: number; y: number; width: number; height: number }
export const cameraPhoto = "https://mzelpafnpdcchykekdux.supabase.co/storage/v1/object/public/photos/IMG_8597.jpg"

export default function CameraOpening({ origin, target, thumbnail }: { origin: Rect; target: RefObject<HTMLButtonElement | null>; thumbnail: string }) {
  const layer = useRef<HTMLDivElement>(null)
  const camera = useRef<HTMLImageElement>(null)
  const photo = useRef<HTMLDivElement>(null)
  const image = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const animations: Animation[] = []
    const frame = requestAnimationFrame(() => {
      if (!layer.current || !camera.current || !photo.current || !image.current || !target.current) return
      const panel = layer.current.getBoundingClientRect()
      const destination = target.current.getBoundingClientRect()
      const width = Math.min(420, panel.width * 0.55), height = width * 0.75
      const x = (panel.width - width) / 2, y = (panel.height - height) / 2
      const start = { left: `${origin.x - panel.x}px`, top: `${origin.y - panel.y}px`, width: `${origin.width}px`, height: `${origin.height}px` }
      const popped = { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` }
      animations.push(camera.current.animate([
        { ...start, opacity: 1, offset: 0 },
        { ...popped, opacity: 1, offset: 0.4 },
        { ...popped, opacity: 1, offset: 0.65 },
        { ...popped, opacity: 0, offset: 1 },
      ], { duration: 1100, easing: "ease-in-out", fill: "both" }))
      // Screen bounds measured in the supplied 1920 × 1440 camera artwork.
      animations.push(photo.current.animate([
        { left: `${x + width * .293}px`, top: `${y + height * .288}px`, width: `${width * .297}px`, height: `${height * .54}px`, borderRadius: "10px", offset: 0 },
        { left: `${x + width * .293}px`, top: `${y + height * .288 - 30}px`, width: `${width * .297}px`, height: `${height * .54}px`, borderRadius: "10px", offset: .2 },
        { left: `${destination.x - panel.x}px`, top: `${destination.y - panel.y}px`, width: `${destination.width}px`, height: `${destination.height}px`, borderRadius: "8px", offset: 1 },
      ], { delay: 550, duration: 1350, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }))
      animations.push(photo.current.animate([{ opacity: 0 }, { opacity: 1 }], { delay: 550, duration: 1, fill: "both" }))
      animations.push(image.current.animate([{ opacity: 0 }, { opacity: 1 }], { delay: 900, duration: 700, fill: "both" }))
    })
    return () => { cancelAnimationFrame(frame); animations.forEach((animation) => animation.cancel()) }
  }, [origin, target])
  return <div ref={layer} className="camera-opening" aria-hidden="true">
    <img ref={camera} src="/camlab-cam6.png" alt="" className="camera-flight" />
    <div ref={photo} className="camera-screen-flight"><img ref={image} src={thumbnail} alt="" /></div>
  </div>
}
