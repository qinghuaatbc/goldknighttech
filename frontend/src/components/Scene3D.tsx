import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Html, Sphere, Box, Cylinder, Line } from '@react-three/drei'
import * as THREE from 'three'

function House({ onSelectZone }: { onSelectZone: (zone: string) => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  const zones = [
    { pos: [-1.5, 0.8, 1], label: 'Living', color: '#e6b800' },
    { pos: [1.5, 0.8, 1], label: 'Kitchen', color: '#60a5fa' },
    { pos: [-1.5, 1.8, -1], label: 'Master Bed', color: '#f472b6' },
    { pos: [1.5, 1.8, -1], label: 'Bedroom 2', color: '#34d399' },
    { pos: [0, 0.8, 1.8], label: 'Dining', color: '#a78bfa' },
    { pos: [0, 1.8, -1.8], label: 'Office', color: '#fb923c' },
  ]

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#e6b800" />

      {/* Floor */}
      <Box args={[6, 0.1, 4]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.8} />
      </Box>

      {/* Walls */}
      {[[0, 1, -2], [0, 1, 2], [-3, 1, 0], [3, 1, 0]].map((pos, i) => (
        <Box key={i} args={[i < 2 ? 6 : 0.1, 2, i < 2 ? 0.05 : 4]} position={pos}>
          <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
        </Box>
      ))}

      {/* Roof */}
      <Cylinder args={[4.5, 4.5, 0.1, 4]} position={[0, 2.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#e6b800" transparent opacity={0.15} />
      </Cylinder>

      {/* Zone markers */}
      {zones.map((z) => (
        <group key={z.label}>
          <mesh
            position={[z.pos[0], 0.05, z.pos[2]]}
            onPointerEnter={() => setHovered(z.label)}
            onPointerLeave={() => setHovered(null)}
            onClick={() => onSelectZone(z.label)}
          >
            <planeGeometry args={[1.8, 1.4]} />
            <meshStandardMaterial
              color={z.color}
              transparent
              opacity={hovered === z.label ? 0.4 : 0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Text
            position={[z.pos[0], 0.2, z.pos[2]]}
            fontSize={0.12}
            color={z.color}
            anchorX="center"
            anchorY="middle"
          >
            {z.label}
          </Text>
          {hovered === z.label && (
            <Html position={[z.pos[0], 0.5, z.pos[2]]} center>
              <div className="px-3 py-1.5 rounded-lg glass text-xs text-white whitespace-nowrap">
                {z.label} Zone
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}

function LightPoint({ pos, color = '#e6b800', intensity = 1 }: { pos: [number, number, number]; color?: string; intensity?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
  })

  return (
    <group position={pos}>
      <Sphere ref={ref} args={[0.08, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} />
      </Sphere>
      <pointLight color={color} intensity={0.3} distance={3} />
    </group>
  )
}

export default function Scene3D({ onSelectZone }: { onSelectZone: (zone: string) => void }) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden glass">
      <Canvas camera={{ position: [5, 4, 6], fov: 50 }}>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <House onSelectZone={onSelectZone} />
        <LightPoint pos={[-2, 1.5, 1]} color="#e6b800" />
        <LightPoint pos={[2, 1.5, -1]} color="#60a5fa" />
        <LightPoint pos={[0, 1.5, 0]} color="#a78bfa" />
        <fog attach="fog" args={['#0b0c11', 8, 15]} />
      </Canvas>
    </div>
  )
}
