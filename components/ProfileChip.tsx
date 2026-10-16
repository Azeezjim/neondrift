'use client'
import type { StartNgPlayer } from '@/hooks/useStartNgPlayer'
export function ProfileChip({ player, isSignedIn, guestMode }: { player: StartNgPlayer | null; isSignedIn: boolean; guestMode: boolean }) { const name = player?.name || 'Guest'; return <div className="profile-chip" title={name}><div className="avatar">{player?.face ? <img src={player.face} alt={`${name} profile`} /> : <span>{name.slice(0, 1)}</span>}</div><div className="profile-copy"><strong>{name}</strong><small>{isSignedIn ? `@${player?.account}` : guestMode ? 'Guest' : 'Not signed in'}</small></div>{!isSignedIn && !guestMode && <button onClick={() => { window.location.href = `https://start.ng/?return_to=${encodeURIComponent(window.location.origin + window.location.pathname)}` }}>Sign in</button>}</div> }
    
