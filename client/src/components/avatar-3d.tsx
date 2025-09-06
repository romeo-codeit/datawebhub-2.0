import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, useAnimations, Loader, Environment } from '@react-three/drei'
import { Suspense, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

const Model = forwardRef((props, ref) => {
  const group = useRef()
  const { scene, animations } = useGLTF('/src/assets/my-avatar-.glb')
  const { actions, mixer } = useAnimations(animations, group)
  const headMesh = useRef();
  const clock = new THREE.Clock();

  useEffect(() => {
    actions.idle.play();
  }, [actions]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isSkinnedMesh && obj.name === 'mesh_3') {
        headMesh.current = obj;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (headMesh.current) {
      const eyeBlinkLeftIndex = headMesh.current.morphTargetDictionary['eyeBlinkLeft'];
      const eyeBlinkRightIndex = headMesh.current.morphTargetDictionary['eyeBlinkRight'];
      const browInnerUpIndex = headMesh.current.morphTargetDictionary['browInnerUp'];
      const browDownLeftIndex = headMesh.current.morphTargetDictionary['browDownLeft'];
      const browDownRightIndex = headMesh.current.morphTargetDictionary['browDownRight'];
      
      const eyeLookUpLeft = headMesh.current.morphTargetDictionary['eyeLookUpLeft'];
      const eyeLookUpRight = headMesh.current.morphTargetDictionary['eyeLookUpRight'];
      const eyeLookDownLeft = headMesh.current.morphTargetDictionary['eyeLookDownLeft'];
      const eyeLookDownRight = headMesh.current.morphTargetDictionary['eyeLookDownRight'];
      const eyeLookInLeft = headMesh.current.morphTargetDictionary['eyeLookInLeft'];
      const eyeLookInRight = headMesh.current.morphTargetDictionary['eyeLookInRight'];
      const eyeLookOutLeft = headMesh.current.morphTargetDictionary['eyeLookOutLeft'];
      const eyeLookOutRight = headMesh.current.morphTargetDictionary['eyeLookOutRight'];

      // --- Blinking ---
      const time = clock.getElapsedTime();
      const blinkCycle = time % 3; // Every 3 seconds
      let blinkValue = 0;
      if (blinkCycle > 2.8) {
        blinkValue = Math.sin((blinkCycle - 2.8) / 0.2 * Math.PI);
      }
      
      if (eyeBlinkLeftIndex !== undefined) {
        headMesh.current.morphTargetInfluences[eyeBlinkLeftIndex] = blinkValue;
      }
      if (eyeBlinkRightIndex !== undefined) {
        headMesh.current.morphTargetInfluences[eyeBlinkRightIndex] = blinkValue;
      }

      // --- Natural Expressions ---
      // Subtle brow movement
      if (browInnerUpIndex !== undefined) {
          const browValue = (Math.sin(time * 0.5) + 1) / 2 * 0.3; // slow up and down
          headMesh.current.morphTargetInfluences[browInnerUpIndex] = browValue;
      }
      if (browDownLeftIndex !== undefined && browDownRightIndex !== undefined) {
          const browValue = (Math.sin(time * 0.7) + 1) / 2 * 0.2; // slow up and down
          headMesh.current.morphTargetInfluences[browDownLeftIndex] = browValue;
          headMesh.current.morphTargetInfluences[browDownRightIndex] = browValue;
      }

      // --- Gaze Shifting ---
      const gazeX = Math.sin(time * 0.4) * 0.5; // -0.5 to 0.5
      const gazeY = Math.cos(time * 0.3) * 0.5; // -0.5 to 0.5

      // Reset gaze
      if (eyeLookUpLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookUpLeft] = 0;
      if (eyeLookUpRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookUpRight] = 0;
      if (eyeLookDownLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookDownLeft] = 0;
      if (eyeLookDownRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookDownRight] = 0;
      if (eyeLookInLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookInLeft] = 0;
      if (eyeLookInRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookInRight] = 0;
      if (eyeLookOutLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookOutLeft] = 0;
      if (eyeLookOutRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookOutRight] = 0;

      // Apply new gaze
      if (gazeX > 0) { // Look right
        if (eyeLookInLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookInLeft] = gazeX;
        if (eyeLookOutRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookOutRight] = gazeX;
      } else { // Look left
        if (eyeLookOutLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookOutLeft] = -gazeX;
        if (eyeLookInRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookInRight] = -gazeX;
      }

      if (gazeY > 0) { // Look up
        if (eyeLookUpLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookUpLeft] = gazeY;
        if (eyeLookUpRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookUpRight] = gazeY;
      } else { // Look down
        if (eyeLookDownLeft !== undefined) headMesh.current.morphTargetInfluences[eyeLookDownLeft] = -gazeY;
        if (eyeLookDownRight !== undefined) headMesh.current.morphTargetInfluences[eyeLookDownRight] = -gazeY;
      }
    }
  });

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

const Avatar3D = forwardRef((props, ref) => {
  return (
    <>
      {/*
        By setting a fixed camera position and FOV, we ensure the framing is always consistent.
        - `position` is [x, y, z]. A `y` of 0.2 looks slightly down at the model.
        - `fov` (field of view) acts like zoom. A smaller `fov` is more zoomed in.
        - `gl={{ preserveDrawingBuffer: true }}` can help prevent flickering on route changes.
      */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.2, 2.8], fov: 30 }} shadows gl={{ preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <Suspense fallback={null}>
        <Environment preset="city" /> {/* Use a preset environment map for realistic lighting */}
        <directionalLight
          position={[3, 3, 3]}
          intensity={5} // Increased intensity
          color="#FFDDBB"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={15}
        />
        <directionalLight
          position={[-3, 3, -3]}
          intensity={3} // Increased intensity
          color="#BBDDFF"
        />
        <Model ref={ref} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
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
})

export default Avatar3D;

useGLTF.preload('/src/assets/my-avatar-.glb')
