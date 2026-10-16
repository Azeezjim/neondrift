'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PlayerCharacter } from './PlayerCharacter'
import { pickPattern } from '@/lib/patterns'

type Props = { lane: number; running: boolean; speed: number; onHit: () => void; onOrb: () => void }
type Item = { z: number; lane: number; kind: 'orb' | 'block'; hit: boolean; phase: number; visible: boolean }

const BASE_SPEED = 18
const ORB_SPEED_GAIN = 2.4
const MAX_SPEED = 48
const SPEED_EASE = .25

function World({ lane, running, speed, onHit, onOrb }: Props) {
  const currentSpeed = Math.min(MAX_SPEED, BASE_SPEED + Math.max(0, speed - .6) * ORB_SPEED_GAIN * 10)
  const items = useMemo<Item[]>(() => Array.from({ length: 24 }, (_, i) => ({ z: -i * 8 - 14, lane: (i * 7) % 3 - 1, kind: i % 4 === 0 ? 'orb' : 'block', hit: false, phase: i * 0.8, visible: true })), [])
  const playerX = lane * 2.2
  const lastLane = useRef(lane)
  const { camera } = useThree()
  useFrame((_, delta) => {
    if (camera instanceof THREE.PerspectiveCamera) { camera.fov = 60 + Math.min(14, currentSpeed * 0.12); camera.updateProjectionMatrix() }
    if (!running) return
    const travel = currentSpeed * delta
    items.forEach(item => {
      item.z += travel
      if (item.z > 8) {
        item.z -= 190
        const pattern = pickPattern(item.z)
        item.lane = pattern.lanes[Math.floor(Math.random() * pattern.lanes.length)] ?? Math.floor(Math.random() * 3) - 1
        item.kind = pattern.kind === 'orb' ? 'orb' : 'block'
        item.hit = false
        item.visible = true
        item.phase = Math.random() * Math.PI * 2
      }
      if (item.kind === 'orb' && item.visible) {
        item.phase += delta * 3
        if (item.z > 8) return
        const dx = item.lane * 2.2 - playerX
        const dz = item.z - 2
        if (dx * dx + dz * dz < 1.1 * 1.1) {
          item.visible = false
          item.z = -220
          onOrb()
        }
      } else if (item.kind === 'block' && !item.hit && item.z > -1.8 && item.z < 1.3 && item.lane === lane) {
        item.hit = true
        onHit()
      }
    })
    if (lastLane.current !== lane) { camera.rotation.z = (lane - lastLane.current) * -0.07; lastLane.current = lane }
    camera.rotation.z *= Math.max(0, 1 - delta * 4)
  })
  return <><color attach="background" args={['#080719']} /><fog attach="fog" args={['#080719', 20, 110]} /><ambientLight intensity={.35} color="#504c9b" /><pointLight position={[0, 5, 8]} intensity={18} distance={24} color="#ff3ea5" /><pointLight position={[0, 2, -25]} intensity={12} distance={40} color="#21e6ff" /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.05, -55]}><planeGeometry args={[8.2, 150]} /><meshStandardMaterial color="#0d0b23" /></mesh>{[-3.3, 3.3].map(x => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, .01, -55]}><planeGeometry args={[.07, 150]} /><meshBasicMaterial color={x < 0 ? '#ff3ea5' : '#21e6ff'} /></mesh>)}{items.map((item, i) => item.kind === 'orb' ? <mesh key={i} visible={item.visible} position={[item.lane * 2.2, 1.4, item.z]} rotation={[0, item.phase, 0]}><icosahedronGeometry args={[.28, 1]} /><meshStandardMaterial color="#d8fd71" emissive="#d8fd71" emissiveIntensity={2} /></mesh> : <mesh key={i} position={[item.lane * 2.2, .72, item.z]}><boxGeometry args={[1.3, 1.4, .7]} /><meshStandardMaterial color="#ff237f" emissive="#ff237f" emissiveIntensity={1.4} /></mesh>)}<group position={[playerX, 0, 2]}><PlayerCharacter style={{ primaryColor: '#ff3ea5', secondaryColor: '#5c6cff', skinColor: '#f6b58e', hairColor: '#151026', accessory: 'backpack' }} speed={currentSpeed} /></group></>
}
export function Scene(props: Props) { return <Canvas dpr={[1, 2]} camera={{ position: [0, 3.85, 9.75], fov: 60 }} gl={{ antialias: true }} fallback={<div className="webgl-fallback">This game needs WebGL</div>}><World {...props} /></Canvas> }
