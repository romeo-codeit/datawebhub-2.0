import { Canvas } from '@react-three/fiber'
import { Stage, useGLTF, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

function Model(props) {
  const { scene } = useGLTF('/src/assets/my-avatar-.glb')
  return <primitive object={scene} {...props} />
}

export default function Avatar3D() {
  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <Stage environment="studio" intensity={0.6} preset="rembrandt" shadows={{ type: 'contact', opacity: 0.7, blur: 2 }}>
          <Model />
        </Stage>
      </Suspense>
      <OrbitControls autoRotate enableZoom={false} enablePan={false} />
    </Canvas>
  )
}

useGLTF.preload('/src/assets/my-avatar-.glb')
