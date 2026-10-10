// Route desktop wheel gestures over menu space to the adjacent content panel.
export function routePanelWheel(event: WheelEvent, article: HTMLElement) {
  if (!window.matchMedia("(min-width: 1024px)").matches || event.ctrlKey || event.shiftKey ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
  const content = article.querySelector<HTMLElement>("[data-panel-content]")
  if (!content || content.contains(event.target as Node) || content.scrollHeight <= content.clientHeight) return
  const delta = event.deltaY * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? content.clientHeight : 1)
  if (!delta || (delta < 0 && content.scrollTop <= 0) ||
      (delta > 0 && content.scrollTop >= content.scrollHeight - content.clientHeight)) return
  event.preventDefault()
  content.scrollTop += delta
}
