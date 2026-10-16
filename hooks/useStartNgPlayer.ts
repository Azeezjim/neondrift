'use client'
import { useCallback, useEffect, useState } from 'react'
import { askStartNg } from '@/lib/startng'
export type Player = { id?: string; name?: string; account?: string; face?: string; style?: Record<string, string> }
export function useStartNgPlayer() {
  const [player, setPlayer] = useState<Player>({ name: 'Guest', style: {} })
  const refresh = useCallback(async () => {
    try { const reply = await askStartNg({ type: 'startng:whoami' }, 'startng:user'); if (reply?.user ?? reply?.guest) setPlayer(reply.user ?? reply.guest) } catch { setPlayer({ name: 'Guest', style: {} }) }
  }, [])
  useEffect(() => { refresh(); addEventListener('visibilitychange', refresh); addEventListener('focus', refresh); return () => { removeEventListener('visibilitychange', refresh); removeEventListener('focus', refresh) } }, [refresh])
  return { player, refresh }
}
