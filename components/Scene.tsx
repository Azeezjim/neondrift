'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { PlayerCharacter } from './PlayerCharacter'

type Props = { lane: number; running: boolean; speed: number; onHit: () => void; onOrb: () => void }
function World({ lane, running, speed, onHit, onOrb }: Props) {
  const items = useRef(Array.from({ length: 18 }, (_, i) => ({ z: -i * 10 - 14, lane: (i * 7) % 3, kind: i % 4 === 0 ? 'orb' : 'block', hit: false })))
  const playerX = lane * 2.2
  useFrame((_, delta) => { if (!running) return; const boost = (5 + speed * .5) * delta; items.current.forEach(item => { item.z += boost; if (item.z > 8) { item.z -= 180; item.lane = Math.floor(Math.random() * 3); item.kind = Math.random() > .72 ? 'orb' : 'block'; item.hit = false } if (item.z > -2 && item.z < 2 && item.lane * 2.2 === playerX && !item.hit) { item.hit = true; item.kind === 'orb' ? onOrb() : onHit() } }) })
  return <>
    <color attach="background" args={['#080719']} /><fog attach="fog" args={['#080719', 22, 125]} />
    <ambientLight intensity={.35} color="#504c9b" /><pointLight position={[0, 5, 8]} intensity={18} distance={24} color="#ff3ea5" /><pointLight position={[0, 2, -25]} intensity={12} distance={40} color="#21e6ff" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.05, -55]}><planeGeometry args={[8.2, 150]} /><meshStandardMaterial color="#0d0b23" /></mesh>
    {[-3.3, 3.3].map(x => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, .01, -55]}><planeGeometry args={[.07, 150]} /><meshBasicMaterial color={x < 0 ? '#ff3ea5' : '#21e6ff'} /></mesh>)}
    {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(i % 7 - 3) * 1.1, -.01, -i * 5 - 4]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.012, 2.1]} /><meshBasicMaterial color="#343067" transparent opacity={.35} /></mesh>)}
    {items.current.map((item, i) => item.kind === 'orb' ? <mesh key={i} position={[item.lane * 2.2, 1.4, item.z]}><icosahedronGeometry args={[.28, 1]} /><meshStandardMaterial color="#d8fd71" emissive="#d8fd71" emissiveIntensity={2} /></mesh> : <mesh key={i} position={[item.lane * 2.2, .72, item.z]}><boxGeometry args={[1.3, 1.4, .7]} /><meshStandardMaterial color="#ff237f" emissive="#ff237f" emissiveIntensity={1.4} /></mesh>)}
    <group position={[playerX, 0, 2]}><PlayerCharacter style={{ primaryColor: '#ff3ea5', secondaryColor: '#5c6cff', skinColor: '#f6b58e', hairColor: '#151026', accessory: 'backpack' }} speed={speed} /></group>
  </>
}
export function Scene(props: Props) { return <Canvas dpr={[1, 2]} camera={{ position: [0, 3.2, 7.5], fov: 54 }} gl={{ antialias: true }}><World {...props} /></Canvas> }
