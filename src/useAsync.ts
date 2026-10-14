import { useEffect, useState } from 'react'
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [s, set] = useState<{ d?: T; e?: string; l: boolean }>({ l: true })
  useEffect(() => {
    let ok = true
    set({ l: true })
    fn().then((d) => ok && set({ d, l: false }), (e) => ok && set({ e: String(e?.message ?? e), l: false }))
    return () => { ok = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return s
}
