'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PlayerCharacter } from './PlayerCharacter'
import { pickPattern } from '@/lib/patterns'

type Props = { lane: number; running: boolean; speed: number; onHit: (obstacleType: string, impactSpeed: number) => void; onOrb: () => void }
type Item = { z: number; lane: number; kind: 'orb' | 'block'; hit: boolean; phase: number; visible: boolean; obstacleType: string }

const BASE_SPEED = 12
const ORB_SPEED_GAIN = 0.7
const MAX_SPEED = 26
const TIME_CREEP = 0.018
const SPEED_EASE = 5
const LANES = [-1, 0, 1]

function World({ lane, running, speed, onHit, onOrb }: Props) {
  const currentSpeed = useRef(BASE_SPEED)
  const elapsed = useRef(0)
  const lastSpawnTime = useRef(-Infinity)
  const previousSafeLane = useRef<number | undefined>(undefined)
  const playerRef = useRef<THREE.Group>(null)
  const { camera, scene } = useThree()
  const items = useMemo<Item[]>(() => Array.from({ length: 18 }, (_, i) => ({ z: -80 - i * 10, lane: i % 3 - 1, kind: i % 5 === 0 ? 'orb' : 'block', hit: false, phase: i * 0.8, visible: true, obstacleType: 'barrier' })), [])
  const playerX = lane * 2.2
  const lastLane = useRef(lane)
  const flashUntil = useRef(0)
  const obstacleFlash = useRef<THREE.Mesh | null>(null)
  const fogDistance = useRef(0)

  useFrame((_, delta) => {
    const targetSpeed = Math.min(MAX_SPEED, BASE_SPEED + speed * ORB_SPEED_GAIN + elapsed.current * TIME_CREEP)
    currentSpeed.current += (targetSpeed - currentSpeed.current) * Math.min(1, delta * SPEED_EASE)
    elapsed.current += delta
    const now = elapsed.current
    const spawnDistance = currentSpeed.current * 1.15
    const minPatternGap = currentSpeed.current * 1.6
    if (Math.abs(spawnDistance - fogDistance.current) > currentSpeed.current * 0.1) {
      fogDistance.current = spawnDistance
      if (scene.fog instanceof THREE.Fog) { scene.fog.near = spawnDistance * 1.1; scene.fog.far = spawnDistance * 2.2 }
    }
    if (camera instanceof THREE.PerspectiveCamera) { camera.fov = 60 + Math.min(10, currentSpeed.current * 0.12); camera.updateProjectionMatrix() }
    if (!running) return
    const travel = currentSpeed.current * delta
    items.forEach((item) => {
      item.z += travel
      if (item.z > 8) {
        if (now < 2.5) { item.z = -spawnDistance - minPatternGap * 2; return }
        const pattern = pickPattern(now, previousSafeLane.current)
        const candidate = pattern.lanes[Math.floor(Math.random() * pattern.lanes.length)] ?? 0
        const gap = Math.max(minPatternGap, currentSpeed.current * 1.6)
        item.z = -spawnDistance - gap
        item.lane = candidate
        item.kind = pattern.kind === 'orb' ? 'orb' : 'block'
        item.obstacleType = pattern.kind === 'orb' ? 'orb' : pattern.name === 'double' ? 'low wall' : 'barrier'
        if (pattern.kind === 'obstacle') previousSafeLane.current = pattern.safeLane
        item.hit = false
        item.visible = true
        item.phase = Math.random() * Math.PI * 2
        lastSpawnTime.current = now
      }
      if (item.kind === 'orb' && item.visible) {
        item.phase += delta * 3
        const dx = item.lane * 2.2 - playerX
        const dz = item.z - 2
        if (dx * dx + dz * dz < 1.1 * 1.1) { item.visible = false; item.z = -240; onOrb() }
      } else if (item.kind === 'block' && !item.hit && item.z > -1.8 && item.z < 1.3 && item.lane === lane) {
        item.hit = true
        flashUntil.current = now + 0.08
        obstacleFlash.current = null
        if (playerRef.current) playerRef.current.traverse((child) => { if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) child.material.color.set('#ffffff') })
        onHit(item.obstacleType, currentSpeed.current)
        window.setTimeout(() => playerRef.current?.traverse((child) => { if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) child.material.color.set(child.material.emissive.getHex() ? child.material.emissive : '#ff3ea5') }), 80)
      }
    })
    if (lastLane.current !== lane) { camera.rotation.z = (lane - lastLane.current) * -0.07; lastLane.current = lane }
    camera.rotation.z *= Math.max(0, 1 - delta * 4)
  })
  return <><color attach="background" args={['#080719']} /><fog attach="fog" args={['#080719', 14, 32]} /><ambientLight intensity={.35} color="#504c9b" /><pointLight position={[0, 5, 8]} intensity={18} distance={24} color="#ff3ea5" /><pointLight position={[0, 2, -25]} intensity={12} distance={40} color="#21e6ff" /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.05, -55]}><planeGeometry args={[8.2, 150]} /><meshStandardMaterial color="#0d0b23" /></mesh>{[-3.3, 3.3].map(x => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, .01, -55]}><planeGeometry args={[.07, 150]} /><meshBasicMaterial color={x < 0 ? '#ff3ea5' : '#21e6ff'} /></mesh>)}{items.map((item, i) => item.kind === 'orb' ? <mesh key={i} visible={item.visible} position={[item.lane * 2.2, 1.4, item.z]} rotation={[0, item.phase, 0]}><icosahedronGeometry args={[.28, 1]} /><meshStandardMaterial color="#d8fd71" emissive="#d8fd71" emissiveIntensity={2} /></mesh> : <mesh key={i} position={[item.lane * 2.2, .72, item.z]}><boxGeometry args={[1.3, 1.4, .7]} /><meshStandardMaterial color="#ff237f" emissive="#ff237f" emissiveIntensity={1.4} /></mesh>)}<group ref={playerRef} position={[playerX, 0, 2]}><PlayerCharacter style={{ primaryColor: '#ff3ea5', secondaryColor: '#5c6cff', skinColor: '#f6b58e', hairColor: '#151026', accessory: 'backpack' }} speed={currentSpeed.current} /></group></>
}
export function Scene(props: Props) { return <Canvas dpr={[1, 2]} camera={{ position: [0, 3.85, 9.75], fov: 60 }} gl={{ antialias: true }} fallback={<div className="webgl-fallback">This game needs WebGL</div>}><World {...props} /></Canvas> }
