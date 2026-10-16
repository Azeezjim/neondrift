export const START_NG = 'https://start.ng'
let framePromise: Promise<HTMLIFrameElement> | null = null
export function connectFrame() {
  framePromise ??= new Promise((resolve, reject) => {
    const el = document.createElement('iframe')
    el.src = `${START_NG}/connect`
    el.hidden = true
    el.onload = () => resolve(el)
    el.onerror = reject
    document.body.append(el)
  })
  return framePromise
}
export async function askStartNg(message: any, replyType: string, timeoutMs = 5000) {
  const el = await connectFrame()
  return new Promise<any>((resolve) => {
    const requestId = Math.random().toString(36).slice(2)
    const done = (reply: any) => { clearTimeout(timer); removeEventListener('message', onMessage); resolve(reply) }
    const timer = setTimeout(() => done(null), timeoutMs)
    function onMessage(e: MessageEvent) {
      if (e.origin !== START_NG || e.source !== el.contentWindow) return
      if (e.data?.type === replyType && e.data.requestId === requestId) done(e.data)
    }
    addEventListener('message', onMessage)
    el.contentWindow!.postMessage({ ...message, requestId }, START_NG)
  })
}
