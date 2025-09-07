import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, useAnimations, Loader } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'

const Model = ({ currentAnimation, currentMorphTargets, ...props }) => {
  const group = useRef()
  const { scene, animations } = useGLTF('/src/assets/my-avatar-.glb')
  const { actions, mixer } = useAnimations(animations, group)
  const headMesh = useRef();
  const clock = new THREE.Clock();

  // Effect to play idle animation by default and handle transitions
  useEffect(() => {
    // Start with the idle animation
    actions.idle.play();
  }, [actions]);

  // Effect to play animation when currentAnimation prop changes
  useEffect(() => {
    const animationName = currentAnimation;
    if (!animationName || !actions[animationName] || animationName === 'idle') {
      return; // Do nothing if the animation is idle, not found, or not provided
    }

    const toAction = actions[animationName];
    const fromAction = actions.idle;

    // Crossfade from idle to the new animation
    fromAction.crossFadeTo(toAction, 0.3, true).play();
    toAction.clampWhenFinished = true;
    toAction.loop = THREE.LoopOnce;

    const onFinished = (e) => {
      if (e.action === toAction) {
        mixer.removeEventListener('finished', onFinished);
        toAction.crossFadeTo(fromAction, 0.3, true).play();
      }
    };

    mixer.addEventListener('finished', onFinished);

    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [currentAnimation, actions, mixer]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isSkinnedMesh && obj.name === 'mesh_3') {
        headMesh.current = obj;
      }
    });
  }, [scene]);

  // Effect to apply morph targets when currentMorphTargets prop changes
  useFrame(() => {
    if (headMesh.current) {
      const time = clock.getElapsedTime();
      const influences = {}; // This will hold the desired state for all morphs this frame

      // --- 1. Procedural Animations (Base Layer) ---

      // Blinking
      const blinkCycle = time % 3; // Every 3 seconds
      let blinkValue = 0;
      if (blinkCycle > 2.8) {
        blinkValue = Math.sin((blinkCycle - 2.8) / 0.2 * Math.PI);
      }
      influences['eyeBlinkLeft'] = blinkValue;
      influences['eyeBlinkRight'] = blinkValue;

      // Gaze Shifting
      const gazeX = Math.sin(time * 0.4) * 0.5; // -0.5 to 0.5
      const gazeY = Math.cos(time * 0.3) * 0.5; // -0.5 to 0.5
      if (gazeX > 0) { // Look right
        influences['eyeLookInLeft'] = gazeX;
        influences['eyeLookOutRight'] = gazeX;
      } else { // Look left
        influences['eyeLookOutLeft'] = -gazeX;
        influences['eyeLookInRight'] = -gazeX;
      }
      if (gazeY > 0) { // Look up
        influences['eyeLookUpLeft'] = gazeY;
        influences['eyeLookUpRight'] = gazeY;
      } else { // Look down
        influences['eyeLookDownLeft'] = -gazeY;
        influences['eyeLookDownRight'] = -gazeY;
      }

      // Natural Expressions (only if no specific expression is sent from backend)
      if (!currentMorphTargets || Object.keys(currentMorphTargets).length === 0) {
        influences['browInnerUp'] = (Math.sin(time * 0.5) + 1) / 2 * 0.3;
        influences['browDownLeft'] = (Math.sin(time * 0.7) + 1) / 2 * 0.2;
        influences['browDownRight'] = (Math.sin(time * 0.7) + 1) / 2 * 0.2;
        
        if (currentAnimation === 'idle') {
          influences['browInnerUp'] = (Math.sin(time * 0.8) + 1) / 2 * 0.2;
          influences['eyeLookUpLeft'] = (Math.sin(time * 0.6 + 0.5) + 1) / 2 * 0.1;
          influences['eyeLookUpRight'] = (Math.sin(time * 0.6 + 0.5) + 1) / 2 * 0.1;
          influences['mouthSmileLeft'] = (Math.sin(time * 0.7 + 1) + 1) / 2 * 0.05;
          influences['mouthSmileRight'] = (Math.sin(time * 0.7 + 1) + 1) / 2 * 0.05;
          influences['noseSneerLeft'] = (Math.sin(time * 0.9 + 2) + 1) / 2 * 0.03;
          influences['noseSneerRight'] = (Math.sin(time * 0.9 + 2) + 1) / 2 * 0.03;
        }
      }

      // --- 2. Backend-Driven Morph Targets (Layer on top) ---
      if (currentMorphTargets) {
        Object.assign(influences, currentMorphTargets);
      }

      // --- 3. Apply the final computed state to the model ---
      // This ensures that any morph not in our `influences` object is reset to 0,
      // preventing expressions from getting stuck.
      for (const key in headMesh.current.morphTargetDictionary) {
        const index = headMesh.current.morphTargetDictionary[key];
        if (index !== undefined) {
          headMesh.current.morphTargetInfluences[index] = influences[key] || 0;
        }
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