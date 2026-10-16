'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
type Props = { style?: Record<string, string>; speed?: number }
export function PlayerCharacter({ style = {}, speed = 0 }: Props) {
  const group = useRef<THREE.Group>(null), head = useRef<THREE.Group>(null), leftLeg = useRef<THREE.Group>(null), rightLeg = useRef<THREE.Group>(null), leftArm = useRef<THREE.Group>(null), rightArm = useRef<THREE.Group>(null), shadow = useRef<THREE.Mesh>(null)
  const phase = useRef(0)
  const body = style.body === 'female' ? 'female' : 'male', hairType = ['short','afro','braids','bun','ponytail','dreads','bald'].includes(style.hair || '') ? style.hair : 'short', hat = ['cap','beanie','tophat','crown'].includes(style.hat || '') ? style.hat : 'none', accessory = ['glasses','earrings','beard','scarf','backpack'].includes(style.accessory || '') ? style.accessory : 'none'
  const primary = style.primaryColor || '#ff3ea5', secondary = style.secondaryColor || '#5c6cff', skin = style.skinColor || '#f6b58e', hair = style.hairColor || '#151026'
  useFrame((_, delta) => {
    const currentSpeed = Math.max(0, speed), cadence = currentSpeed > 2 ? currentSpeed * .55 : 5
    phase.current = (phase.current + delta * cadence) % (Math.PI * 2)
    const runPhase = phase.current, amplitude = currentSpeed > 2 ? .55 + Math.min(1, currentSpeed / 48) * .6 : .35
    const legSwing = Math.sin(runPhase) * amplitude, oppositeSwing = Math.sin(runPhase + Math.PI) * amplitude
    const leftFoot = Math.max(0, Math.sin(runPhase) * .7 * .22), rightFoot = Math.max(0, Math.sin(runPhase + Math.PI) * .7 * .22)
    if (leftLeg.current) { leftLeg.current.rotation.x = legSwing; leftLeg.current.position.y = .9 + leftFoot }
    if (rightLeg.current) { rightLeg.current.rotation.x = oppositeSwing; rightLeg.current.position.y = .9 + rightFoot }
    if (leftArm.current) { leftArm.current.rotation.x = -legSwing * .8; leftArm.current.rotation.z = -.4 }
    if (rightArm.current) { rightArm.current.rotation.x = -oppositeSwing * .8; rightArm.current.rotation.z = .4 }
    if (group.current) { group.current.position.y = Math.abs(Math.sin(runPhase)) * .09; group.current.rotation.z = -(.22 + Math.min(1, currentSpeed / 48) * .2); group.current.rotation.y = Math.sin(runPhase) * .1 }
    if (head.current) head.current.position.y = 2.25 + Math.abs(Math.sin(runPhase + 1.6)) * .04
    if (shadow.current) { const footfall = Math.abs(Math.sin(runPhase)); shadow.current.scale.setScalar(.82 + footfall * .18); (shadow.current.material as THREE.MeshBasicMaterial).opacity = .28 + footfall * .08 }
  })
  const hairPart = hairType === 'afro' ? <mesh position={[0,2.48,0]}><sphereGeometry args={[.4,10,8]}/><meshStandardMaterial color={hair}/></mesh> : hairType === 'bald' ? null : <mesh position={[0,2.43,0]}><sphereGeometry args={[hairType === 'short' ? .3 : .33,10,7]}/><meshStandardMaterial color={hair}/></mesh>
  return <group ref={group}><mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, .015, 0]} scale={[.82, .5, 1]}><circleGeometry args={[.5, 24]} /><meshBasicMaterial color="#050313" transparent opacity={.3} /></mesh>
    <mesh position={[0,1.66,0]} scale={[body === 'female' ? .88 : 1,1,1]}><boxGeometry args={[.62,.72,.38]}/><meshStandardMaterial color={primary} emissive={primary} emissiveIntensity={.3}/></mesh>
    <group ref={head}><mesh><sphereGeometry args={[.28,10,8]}/><meshStandardMaterial color={skin}/></mesh></group>{hairPart}
    {hat === 'cap' && <><mesh position={[0,2.53,0]}><sphereGeometry args={[.32,10,6]}/><meshStandardMaterial color={primary}/></mesh><mesh position={[.16,2.47,.12]} rotation={[0,.2,0]}><boxGeometry args={[.3,.04,.18]}/><meshStandardMaterial color={primary}/></mesh></>}
    {hat === 'beanie' && <><mesh position={[0,2.48,0]}><sphereGeometry args={[.33,10,7]}/><meshStandardMaterial color={secondary}/></mesh><mesh position={[0,2.3,0]}><cylinderGeometry args={[.32,.32,.1,12]}/><meshStandardMaterial color={primary}/></mesh></>}
    {hat === 'tophat' && <><mesh position={[0,2.62,0]}><cylinderGeometry args={[.2,.2,.45,12]}/><meshStandardMaterial color={primary}/></mesh><mesh position={[0,2.4,0]}><cylinderGeometry args={[.4,.4,.06,12]}/><meshStandardMaterial color={primary}/></mesh></>}
    {hat === 'crown' && <><mesh position={[0,2.48,0]}><cylinderGeometry args={[.3,.3,.16,10]}/><meshStandardMaterial color={primary}/></mesh>{[-.18,0,.18].map(x => <mesh key={x} position={[x,2.64,0]} rotation={[0,0,x ? (x > 0 ? -.2 : .2) : 0]}><coneGeometry args={[.08,.22,4]}/><meshStandardMaterial color={primary}/></mesh>)}</>}
    <group ref={leftLeg} position={[-(body === 'female' ? .14 : .18),1.2,0]}><mesh position={[0,-.36,0]}><boxGeometry args={[.2,.7,.24]}/><meshStandardMaterial color={secondary}/></mesh></group><group ref={rightLeg} position={[body === 'female' ? .14 : .18,1.2,0]}><mesh position={[0,-.36,0]}><boxGeometry args={[.2,.7,.24]}/><meshStandardMaterial color={secondary}/></mesh></group>
    {body === 'female' && <mesh position={[0,1.28,0]} scale={[1.15,1,.7]}><cylinderGeometry args={[.34,.42,.22,8]}/><meshStandardMaterial color={secondary}/></mesh>}
    <group ref={leftArm} position={[-.4,1.85,0]}><mesh position={[0,-.28,0]}><capsuleGeometry args={[.1,.42,4,8]}/><meshStandardMaterial color={skin}/></mesh></group><group ref={rightArm} position={[.4,1.85,0]}><mesh position={[0,-.28,0]}><capsuleGeometry args={[.1,.42,4,8]}/><meshStandardMaterial color={skin}/></mesh></group>
    {accessory === 'glasses' && <><mesh position={[-.12,2.27,.25]}><torusGeometry args={[.09,.018,6,12]}/><meshStandardMaterial color="#17152b"/></mesh><mesh position={[.12,2.27,.25]}><torusGeometry args={[.09,.018,6,12]}/><meshStandardMaterial color="#17152b"/></mesh><mesh position={[0,2.27,.25]}><boxGeometry args={[.08,.02,.02]}/><meshStandardMaterial color="#17152b"/></mesh></>}
    {accessory === 'earrings' && [-1,1].map(side => <mesh key={side} position={[side*.29,2.16,.05]}><sphereGeometry args={[.045,6,6]}/><meshStandardMaterial color={primary} emissive={primary}/></mesh>)}{accessory === 'beard' && <mesh position={[0,2.12,.22]} scale={[.7,.5,.3]}><sphereGeometry args={[.16,8,6]}/><meshStandardMaterial color={hair}/></mesh>}{accessory === 'scarf' && <><mesh position={[0,1.98,0]}><torusGeometry args={[.25,.07,6,16]}/><meshStandardMaterial color={primary}/></mesh><mesh position={[.25,1.75,.02]} rotation={[0,0,-.25]}><boxGeometry args={[.1,.5,.08]}/><meshStandardMaterial color={primary}/></mesh></>}{accessory === 'backpack' && <mesh position={[0,1.7,-.28]}><boxGeometry args={[.5,.6,.15]}/><meshStandardMaterial color={secondary}/></mesh>}
  </group>
}
    
