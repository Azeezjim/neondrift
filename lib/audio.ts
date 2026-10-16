let ctx: AudioContext | null = null
let muted = true
export function setAudioMuted(value: boolean) { muted = value; if (value) void ctx?.suspend() }
function ready() { if (muted || typeof window === 'undefined') return null; ctx ??= new AudioContext(); void ctx.resume(); return ctx }
export function playPickup(step = 0) { const audio = ready(); if (!audio) return; [660 + step * 35, 880 + step * 35].forEach((frequency, index) => { const osc = audio.createOscillator(), gain = audio.createGain(); osc.frequency.value = frequency; gain.gain.setValueAtTime(.0001, audio.currentTime + index * .07); gain.gain.exponentialRampToValueAtTime(.06, audio.currentTime + index * .07 + .01); gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + index * .07 + .12); osc.connect(gain).connect(audio.destination); osc.start(audio.currentTime + index * .07); osc.stop(audio.currentTime + index * .07 + .13) }) }
export function playNearMiss() { playPickup(-5) }
    
