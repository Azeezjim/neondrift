'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { askStartNg } from '@/lib/startng'
export type StartNgPlayer = { id?: string; name?: string; account?: string; face?: string; color?: string; style?: Record<string, string> }
export type Player = StartNgPlayer
export function useStartNgPlayer() {
  const guestMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('guest')
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')
  const [player, setPlayer] = useState<StartNgPlayer | null>(guestMode ? { name: 'Guest', style: {} } : null)
  const [error, setError] = useState<string | null>(null)
  const lastRefresh = useRef(0)
  const readyRef = useRef(false)
  const refresh = useCallback(async () => {
    if (guestMode && readyRef.current) return
    const now = Date.now(); if (now - lastRefresh.current < 1000) return; lastRefresh.current = now
    const reply = await askStartNg({ type: 'startng:whoami' }, 'startng:user')
    const next = reply?.user ?? reply?.guest ?? null
    setPlayer(next); readyRef.current = true; setStatus('ready')
    if (reply === null) { setError('start.ng connection timed out'); console.info('[v0] start.ng player lookup timed out') }
  }, [guestMode, status])
  useEffect(() => { void refresh(); const onVisible = () => document.visibilityState === 'visible' && void refresh(); const onFocus = () => void refresh(); addEventListener('visibilitychange', onVisible); addEventListener('focus', onFocus); return () => { removeEventListener('visibilitychange', onVisible); removeEventListener('focus', onFocus) } }, [refresh])
  return { status, player, isGuest: guestMode || !player?.id, isSignedIn: Boolean(player?.id && player?.account), refresh, error }
}
export const guestPlayer: StartNgPlayer = { name: 'Guest', style: {} }
    
