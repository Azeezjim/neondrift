export type Pattern = { name: string; weight: number; lanes: number[]; kind: 'obstacle' | 'orb'; safeLane: number }

export const patterns: Pattern[] = [
  { name: 'single', weight: 5, lanes: [0], kind: 'obstacle', safeLane: -1 },
  { name: 'single-left', weight: 4, lanes: [-1], kind: 'obstacle', safeLane: 1 },
  { name: 'single-right', weight: 4, lanes: [1], kind: 'obstacle', safeLane: -1 },
  { name: 'double', weight: 2, lanes: [-1, 1], kind: 'obstacle', safeLane: 0 },
  { name: 'orb-lane', weight: 1, lanes: [0], kind: 'orb', safeLane: 0 },
]

export function pickPattern(distance: number, previousSafeLane?: number) {
  const eligible = patterns.filter((pattern) => pattern.kind === 'orb' || pattern.safeLane !== previousSafeLane)
  const total = eligible.reduce((sum, pattern) => sum + pattern.weight + (pattern.kind === 'orb' ? Math.max(0, distance) / 5000 : 0), 0)
  let cursor = Math.random() * total
  return eligible.find((pattern) => (cursor -= pattern.weight) <= 0) ?? eligible[0]
}
