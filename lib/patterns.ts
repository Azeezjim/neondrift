export type Pattern = { name: string; weight: number; lanes: number[]; kind: 'obstacle' | 'orb' }
export const patterns: Pattern[] = [
  { name: 'single', weight: 5, lanes: [0], kind: 'obstacle' },
  { name: 'double', weight: 3, lanes: [-1, 1], kind: 'obstacle' },
  { name: 'slalom', weight: 2, lanes: [-1, 0, 1], kind: 'obstacle' },
  { name: 'orb-lane', weight: 1, lanes: [0], kind: 'orb' },
]
export function pickPattern(distance: number) { const total = patterns.reduce((sum, p) => sum + p.weight + distance / 5000 * (p.name === 'orb-lane' ? 1 : 0), 0); let cursor = Math.random() * total; return patterns.find(p => (cursor -= p.weight) <= 0) || patterns[0] }
    
