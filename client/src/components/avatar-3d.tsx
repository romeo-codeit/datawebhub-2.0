import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, useAnimations, Loader } from '@react-three/drei'
import { Suspense, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'

const Model = forwardRef(({ currentAnimation, currentMorphTargets, ...props }, ref) => {
  const group = useRef()
  const { scene, animations } = useGLTF('/src/assets/my-avatar-.glb')
  const { actions, mixer } = useAnimations(animations, group)
  const skinnedMeshes = useRef([]);
  const clock = new THREE.Clock();

  useEffect(() => {
    const meshes = [];
    scene.traverse((obj) => {
      // We are looking for skinned meshes that have morph targets
      if (obj.isSkinnedMesh && obj.morphTargetDictionary) {
        meshes.push(obj);
      }
    });
    skinnedMeshes.current = meshes;
  }, [scene]);

  // Effect to play animation when currentAnimation prop changes
  useEffect(() => {
    if (ref.current && ref.current.playAnimation) {
      ref.current.playAnimation(currentAnimation || 'idle');
    }
  }, [currentAnimation, ref]);

  // Effect to apply morph targets when currentMorphTargets prop changes
  useEffect(() => {
    if (skinnedMeshes.current.length > 0 && currentMorphTargets) {
      // Reset all morph targets to 0 before applying new values
      skinnedMeshes.current.forEach(mesh => {
        if (mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences.fill(0);
        }
      });

      for (const [key, value] of Object.entries(currentMorphTargets)) {
        skinnedMeshes.current.forEach(mesh => {
          const morphTargetIndex = mesh.morphTargetDictionary[key];
          if (morphTargetIndex !== undefined) {
            mesh.morphTargetInfluences[morphTargetIndex] = value;
          }
        });
      }
    }
  }, [currentMorphTargets]);

  useFrame(() => {
    // Apply procedural animations only if not overridden by currentMorphTargets from backend
    if ((!currentMorphTargets || Object.keys(currentMorphTargets).length === 0)) {
      const time = clock.getElapsedTime();

      // Find the head mesh for procedural animations (blinking, looking around)
      const headMesh = skinnedMeshes.current.find(m => m.morphTargetDictionary['eyeBlinkLeft'] !== undefined);

      if (headMesh) {
        // Reset all morph targets to 0 before applying procedural animations
        skinnedMeshes.current.forEach(mesh => {
          if (mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences.fill(0);
          }
        });

        const eyeBlinkLeftIndex = headMesh.morphTargetDictionary['eyeBlinkLeft'];
        const eyeBlinkRightIndex = headMesh.morphTargetDictionary['eyeBlinkRight'];
        const browInnerUpIndex = headMesh.morphTargetDictionary['browInnerUp'];
        const browDownLeftIndex = headMesh.morphTargetDictionary['browDownLeft'];
        const browDownRightIndex = headMesh.morphTargetDictionary['browDownRight'];
        const eyeLookUpLeftIndex = headMesh.morphTargetDictionary['eyeLookUpLeft'];
        const eyeLookUpRightIndex = headMesh.morphTargetDictionary['eyeLookUpRight'];
        const eyeLookDownLeftIndex = headMesh.morphTargetDictionary['eyeLookDownLeft'];
        const eyeLookDownRightIndex = headMesh.morphTargetDictionary['eyeLookDownRight'];
        const eyeLookInLeftIndex = headMesh.morphTargetDictionary['eyeLookInLeft'];
        const eyeLookInRightIndex = headMesh.morphTargetDictionary['eyeLookInRight'];
        const eyeLookOutLeftIndex = headMesh.morphTargetDictionary['eyeLookOutLeft'];
        const eyeLookOutRightIndex = headMesh.morphTargetDictionary['eyeLookOutRight'];

        // --- Blinking ---
        const blinkCycle = time % 3; // Every 3 seconds
        let blinkValue = 0;
        if (blinkCycle > 2.8) {
          blinkValue = Math.sin((blinkCycle - 2.8) / 0.2 * Math.PI);
        }
        if (eyeBlinkLeftIndex !== undefined) headMesh.morphTargetInfluences[eyeBlinkLeftIndex] = blinkValue;
        if (eyeBlinkRightIndex !== undefined) headMesh.morphTargetInfluences[eyeBlinkRightIndex] = blinkValue;

        // --- Natural Expressions (Subtle brow movement) ---
        if (browInnerUpIndex !== undefined) {
          const browValue = (Math.sin(time * 0.5) + 1) / 2 * 0.3;
          headMesh.morphTargetInfluences[browInnerUpIndex] = browValue;
        }
        if (browDownLeftIndex !== undefined && browDownRightIndex !== undefined) {
          const browValue = (Math.sin(time * 0.7) + 1) / 2 * 0.2;
          headMesh.morphTargetInfluences[browDownLeftIndex] = browValue;
          headMesh.morphTargetInfluences[browDownRightIndex] = browValue;
        }

        // --- Gaze Shifting ---
        const gazeX = Math.sin(time * 0.4) * 0.5;
        const gazeY = Math.cos(time * 0.3) * 0.5;

        if (gazeX > 0) { // Look right
          if (eyeLookInLeftIndex !== undefined) headMesh.morphTargetInfluences[eyeLookInLeftIndex] = gazeX;
          if (eyeLookOutRightIndex !== undefined) headMesh.morphTargetInfluences[eyeLookOutRightIndex] = gazeX;
        } else { // Look left
          if (eyeLookOutLeftIndex !== undefined) headMesh.morphTargetInfluences[eyeLookOutLeftIndex] = -gazeX;
          if (eyeLookInRightIndex !== undefined) headMesh.morphTargetInfluences[eyeLookInRightIndex] = -gazeX;
        }

        if (gazeY > 0) { // Look up
          if (eyeLookUpLeftIndex !== undefined) headMesh.morphTargetInfluences[eyeLookUpLeftIndex] = gazeY;
          if (eyeLookUpRightIndex !== undefined) headMesh.morphTargeInfluences[eyeLookUpRightIndex] = gazeY;
        } else { // Look down
          if (eyeLookDownLeftIndex !== undefined) headMesh.morphTargetInfluences[eyeLookDownLeftIndex] = -gazeY;
          if (eyeLookDownRightIndex !== undefined) headMesh.morphTargetInfluences[eyeLookDownRightIndex] = -gazeY;
        }
      }
    }
  });

  const currentAnimationName = useRef('idle');

  useEffect(() => {
    const onFinished = (e) => {
      // When a non-looped animation finishes, transition back to idle
      if (e.action.loop !== THREE.LoopRepeat) {
        // Ensure we are not already trying to play idle
        if (currentAnimationName.current !== 'idle') {
          ref.current?.playAnimation('idle');
        }
      }
    };

    mixer.addEventListener('finished', onFinished);

    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [mixer, ref]);

  useImperativeHandle(ref, () => ({
    playAnimation: (name) => {
      if (!actions[name] || currentAnimationName.current === name) return;

      const fromAction = actions[currentAnimationName.current];
      const toAction = actions[name];

      if (!fromAction || !toAction) return;

      fromAction.reset().crossFadeTo(toAction, 0.3, true).play();
      currentAnimationName.current = name;

      if (name !== 'idle') {
        toAction.clampWhenFinished = true;
        toAction.loop = THREE.LoopOnce;
      } else {
        toAction.loop = THREE.LoopRepeat;
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

interface Avatar3DProps {
  currentAnimation?: string;
  currentMorphTargets?: { [key: string]: number };
}

export default function Avatar3D({ currentAnimation, currentMorphTargets }: Avatar3DProps) {
  const modelRef = useRef()

  return (
    <>
      {/*
        By setting a fixed camera position and FOV, we ensure the framing is always consistent.
        - `position` is [x, y, z]. A `y` of 0.2 looks slightly down at the model.
        - `fov` (field of view) acts like zoom. A smaller `fov` is more zoomed in.
        - `gl={{ preserveDrawingBuffer: true }}` can help prevent flickering on route changes.
      */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.2, 2.8], fov: 30 }} shadows gl={{ preserveDrawingBuffer: true, antialias: true }}>
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
        <Model ref={modelRef} currentAnimation={currentAnimation} currentMorphTargets={currentMorphTargets} />
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