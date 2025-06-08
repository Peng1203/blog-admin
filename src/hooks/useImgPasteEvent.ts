import { onMounted, onUnmounted, useTemplateRef } from 'vue'

/**
 * 粘贴图片处理 Hook
 * @param refStr - 元素 ref 的值
 * @param handler - 回调处理
 */
export function useImgPasteEvent(refStr: string, handler: (event: ClipboardEvent) => void) {
  const PASTE_EVENT = 'paste'
  const elRef = useTemplateRef<RefType>(refStr)

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.addEventListener(PASTE_EVENT, handler as EventListener)
  })

  onUnmounted(() => {
    const el = elRef.value
    if (!el) return
    el.removeEventListener(PASTE_EVENT, handler as EventListener)
  })
}
