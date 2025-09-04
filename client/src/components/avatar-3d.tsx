import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Loader } from '@react-three/drei'
import { Suspense, useRef, useEffect, forwardRef } from 'react'
import * as THREE from 'three'

const Model = forwardRef((props, ref) => {
  const group = useRef()
  const { scene } = useGLTF('/src/assets/my-avatar-.glb')
  const headMesh = useRef();

  useEffect(() => {
    const head = scene.getObjectByName('AvatarHead');
    if (head && head.isSkinnedMesh) {
        console.log('Found head mesh by name "AvatarHead":', head);
        headMesh.current = head;
    } else {
        console.log('Head mesh with name "AvatarHead" not found. Falling back to first skinned mesh.');
        scene.traverse((obj) => {
            if (obj.isSkinnedMesh && obj.morphTargetDictionary) {
                if (!headMesh.current) {
                    console.log('Using first skinned mesh with morph targets:', obj);
                    headMesh.current = obj;
                }
            }
        });
    }
  }, [scene]);

  useFrame(() => {
    if (headMesh.current) {
      const jawOpenIndex = headMesh.current.morphTargetDictionary['jawOpen'];

      if (jawOpenIndex !== undefined) {
        headMesh.current.morphTargetInfluences[jawOpenIndex] = 1;
      }
    }
  });

  // We only need an effect to ensure all meshes in the model can cast shadows.
  // The positioning and scaling is now handled declaratively in the JSX below.
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
      }
    });
  }, [scene]);

  // By wrapping the model in a group and applying transformations here,
  // we ensure the position is fixed and doesn't shift on page navigation.
  // The y-position is negative to move the model down, creating the waist-up cutoff.
  // You may need to tweak `position` and `scale` to perfectly frame your avatar.
  return (
    <group {...props} position={[0, -1.7, 0]} scale={1.2}>
      <primitive object={scene} ref={group} />
    </group>
  );
})

export default function Avatar3D() {
  const modelRef = useRef()

  // Example of how to call playAnimation from the parent component
  // This would be triggered by an event, e.g., when the AI starts speaking.
  const handlePlayTalkAnimation = () => {
    // This will not work now as useImperativeHandle is removed
    // if (modelRef.current) {
    //   modelRef.current.playAnimation('talk');
    // }
  }

  return (
    <>
      {/*
        By setting a fixed camera position and FOV, we ensure the framing is always consistent.
        - `position` is [x, y, z]. A `y` of 0.2 looks slightly down at the model.
        - `fov` (field of view) acts like zoom. A smaller `fov` is more zoomed in.
        - `gl={{ preserveDrawingBuffer: true }}` can help prevent flickering on route changes.
      */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.2, 2.8], fov: 30 }} shadows gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[3, 3, 3]}
          intensity={3.5}
          color="#FFDDBB"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={15}
        />
        <directionalLight
          position={[-3, 3, -3]}
          intensity={2.5}
          color="#BBDDFF"
        />
        <hemisphereLight groundColor="#000000" skyColor="#ffffff" intensity={1.5} />
        <Model ref={modelRef} />
      </Suspense>
      <OrbitControls
        // The target is now lowered to better frame the upper body
        target={[0, 0.2, 0]}
        enableZoom={false}
        enablePan={false}
        enabled={false}
        makeDefault
      />
    </Canvas>
      <Loader />
    </>
  )
}

useGLTF.preload('/src/assets/my-avatar-.glb')
