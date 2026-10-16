'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = { style?: Record<string, string>; speed?: number }
export function PlayerCharacter({ style = {}, speed = 0 }: Props) {
  const group = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null); const rightLeg = useRef<THREE.Group>(null); const leftArm = useRef<THREE.Group>(null); const rightArm = useRef<THREE.Group>(null)
  const primary = style.primaryColor || '#ff3ea5', secondary = style.secondaryColor || '#5c6cff', skin = style.skinColor || '#f6b58e', hair = style.hairColor || '#151026'
  useFrame(({ clock }) => { const t = clock.elapsedTime * (3 + speed * .35); const swing = Math.sin(t) * .42; if (leftLeg.current) leftLeg.current.rotation.x = swing; if (rightLeg.current) rightLeg.current.rotation.x = -swing; if (leftArm.current) leftArm.current.rotation.x = -swing; if (rightArm.current) rightArm.current.rotation.x = swing; if (group.current) group.current.position.y = Math.abs(Math.sin(t * 2)) * .035 })
  return <group ref={group}>
    <mesh position={[0, 1.65, 0]}><boxGeometry args={[.62, .72, .38]} /><meshStandardMaterial color={primary} emissive={primary} emissiveIntensity={.35} /></mesh>
    <mesh position={[0, 2.25, 0]}><sphereGeometry args={[.28, 8, 6]} /><meshStandardMaterial color={skin} /></mesh>
    {style.hair !== 'bald' && <mesh position={[0, 2.43, 0]}><sphereGeometry args={[.29, 8, 5, 0, Math.PI * 2, 0, Math.PI * .48]} /><meshStandardMaterial color={hair} /></mesh>}
    <group ref={leftLeg} position={[-.18, 1.2, 0]}><mesh position={[0, -.36, 0]}><boxGeometry args={[.2, .7, .24]} /><meshStandardMaterial color={secondary} emissive={secondary} emissiveIntensity={.18} /></mesh></group>
    <group ref={rightLeg} position={[.18, 1.2, 0]}><mesh position={[0, -.36, 0]}><boxGeometry args={[.2, .7, .24]} /><meshStandardMaterial color={secondary} emissive={secondary} emissiveIntensity={.18} /></mesh></group>
    <group ref={leftArm} position={[-.4, 1.85, 0]}><mesh position={[0, -.28, 0]}><capsuleGeometry args={[.1, .42, 4, 8]} /><meshStandardMaterial color={skin} /></mesh></group>
    <group ref={rightArm} position={[.4, 1.85, 0]}><mesh position={[0, -.28, 0]}><capsuleGeometry args={[.1, .42, 4, 8]} /><meshStandardMaterial color={skin} /></mesh></group>
    {style.accessory === 'backpack' && <mesh position={[0, 1.72, -.25]}><boxGeometry args={[.48, .58, .12]} /><meshStandardMaterial color="#d8fd71" emissive="#d8fd71" emissiveIntensity={.3} /></mesh>}
  </group>
}
