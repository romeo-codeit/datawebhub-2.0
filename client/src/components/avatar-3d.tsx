import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, useAnimations, Loader } from '@react-three/drei'
import { Suspense, useLayoutEffect, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'

const Model = forwardRef((props, ref) => {
  const group = useRef()
  const { scene, animations } = useGLTF('/src/assets/my-avatar-.glb')
  const { actions, mixer } = useAnimations(animations, group)

  useEffect(() => {
    actions.idle.play();
  }, [actions]);

  useImperativeHandle(ref, () => ({
    playAnimation: (name) => {
      if (!actions[name]) return;

      const from = actions.idle;
      const to = actions[name];

      from.reset().crossFadeTo(to, 0.3, true).play();

      if (name !== 'idle') {
        to.clampWhenFinished = true;
        to.loop = THREE.LoopOnce;

        const onFinished = () => {
          to.crossFadeTo(from.reset(), 0.3, true).play();
          mixer.removeEventListener('finished', onFinished);
        }
        mixer.addEventListener('finished', onFinished);
      }
    }
  }));

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
      }
    });
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.8 / maxDim;

      scene.scale.set(scale, scale, scale);
      // Move the model down by 0.6 units to create a waist-up cutoff
      scene.position.set(-center.x * scale, -center.y * scale - 0.6, -center.z * scale);
    }
  }, [scene])

  return <primitive object={scene} {...props} ref={group} />
})

export default function Avatar3D() {
  const modelRef = useRef()

  // Example of how to call playAnimation from the parent component
  // This would be triggered by an event, e.g., when the AI starts speaking.
  const handlePlayTalkAnimation = () => {
    if (modelRef.current) {
      modelRef.current.playAnimation('talk');
    }
  }

  return (
    <>
      <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0.6, 2.2] }} shadows>
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
        target={[0, 0.6, 0]}
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
