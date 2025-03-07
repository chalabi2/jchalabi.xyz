"use client";

import { useRef, useEffect, Suspense, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import React from "react";

import {
  OrbitControls,
  Environment,
  useGLTF,
  PerspectiveCamera,
  Loader,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  DepthOfField,
} from "@react-three/postprocessing";
import * as THREE from "three";

// Model component that loads and displays the GLB file
const SpaceModel = React.forwardRef<THREE.Group>((props, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/need_some_space.glb");

  // Sync the forwarded ref with our local ref
  useEffect(() => {
    if (ref && groupRef.current) {
      if (typeof ref === "function") {
        ref(groupRef.current);
      } else {
        ref.current = groupRef.current;
      }
    }
  }, [ref]);

  // Apply materials or adjustments to the model if needed
  useEffect(() => {
    if (scene) {
      // Clone the scene to avoid modifying the cached original
      const clonedScene = scene.clone();

      // Traverse the scene to find particle systems or materials to enhance
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Enhance material properties if needed
          if (child.material instanceof THREE.MeshStandardMaterial) {
            // Clone the material to avoid modifying shared materials
            child.material = child.material.clone();
            child.material.emissive = new THREE.Color(0x4060ff);
            child.material.emissiveIntensity = 0.5;
          }
        }
      });

      // Replace the original scene with our modified clone
      groupRef.current?.clear();
      groupRef.current?.add(clonedScene);
    }

    // Cleanup function to dispose of materials and geometries
    return () => {
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose();
            }

            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [scene]);

  // Add a subtle animation to the points
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle breathing effect
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t / 10) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {scene && <primitive object={scene} dispose={null} />}
    </group>
  );
});

SpaceModel.displayName = "SpaceModel";

// Scene content component that uses Three.js hooks
interface SceneContentProps {
  modelRef: React.RefObject<THREE.Group | null>;
  isRotating: boolean;
}

const SceneContent: React.FC<SceneContentProps> = ({
  modelRef,
  isRotating,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Use useFrame to rotate the camera horizontally
  useFrame(({ clock }) => {
    if (isRotating && cameraRef.current) {
      // Get the current camera position
      const camera = cameraRef.current;
      const currentPosition = new THREE.Vector3();
      currentPosition.copy(camera.position);

      // Calculate new position by rotating around the Y axis
      const radius = Math.sqrt(
        currentPosition.x * currentPosition.x +
          currentPosition.z * currentPosition.z
      );
      // Small increment for rotation (using clock for smooth animation)
      const theta =
        Math.atan2(currentPosition.z, currentPosition.x) +
        clock.getDelta() * 0.3;

      camera.position.x = radius * Math.cos(theta);
      camera.position.z = radius * Math.sin(theta);

      // Keep the camera looking at the center
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Enhanced universal fog for the space effect - matched to app background */}
      <fogExp2
        attach="fog"
        color={new THREE.Color("#131525")} // Hex equivalent of the OKLCH color
        density={0.015} // Reduced density for more subtle effect
        args={["#131525", 0.015]}
      />

      <PerspectiveCamera
        ref={cameraRef}
        rotation={[-2.46, 0.67, 2.68]}
        position={[2.73, 2.16, -2.68]}
        makeDefault
        fov={60}
      />

      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.15} color="#404060" />

      {/* Bright central light source - increased intensity for the bright center */}
      <pointLight
        position={[0, 0, 0]}
        intensity={4}
        color="#ffffff"
        distance={8}
        decay={1.5}
      />

      {/* Secondary light for the blue glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#4060ff"
        distance={12}
        decay={2}
      />

      {/* Soft fill light from above */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.3}
        color="#8080ff"
        distance={15}
        decay={2}
      />

      {/* The main model */}
      <SpaceModel ref={modelRef} />

      {/* Environment for reflections - changed to night for space theme */}
      <Environment preset="night" />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        zoomSpeed={0.5}
        minDistance={2}
        maxDistance={20}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        {/* Adjusted Bloom effect to work better with fog */}
        <Bloom
          luminanceThreshold={0.05} // Slightly higher threshold to reduce bloom intensity
          luminanceSmoothing={0.9} // Increased smoothing for softer edges
          height={400}
          intensity={1.8} // Reduced intensity to complement the fog
          kernelSize={5}
        />

        {/* Subtle depth of field */}
        <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={3} />

        {/* Very subtle noise for texture */}
        <Noise opacity={0.015} />
      </EffectComposer>
    </>
  );
};

// Main ThreeJS scene component
const ThreeScene = () => {
  const modelRef = useRef<THREE.Group>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle component unmounting and cleanup
  useEffect(() => {
    return () => {
      // Cleanup any resources when component unmounts
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);

  // Handle model loading completion
  const handleModelLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Preload the model with error handling
  useEffect(() => {
    useGLTF.preload("/need_some_space.glb");
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        camera={{ fov: 60 }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          // Set renderer properties with type-safe approach
          gl.setPixelRatio(window.devicePixelRatio);

          // Apply tone mapping
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <Suspense fallback={<LoadingFallback onLoaded={handleModelLoaded} />}>
          <SceneContent modelRef={modelRef} isRotating={true} />
        </Suspense>
      </Canvas>

      {/* Show loader until model is loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader
            dataInterpolation={(p) => `Loading 3D model... ${Math.round(p)}%`}
            barStyles={{ background: "#4060ff" }}
            innerStyles={{ background: "var(--foreground)" }}
            dataStyles={{ color: "var(--foreground)" }}
            containerStyles={{
              background: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      )}
    </div>
  );
};

// Custom loading fallback that triggers when 3D content is ready
const LoadingFallback = ({ onLoaded }: { onLoaded: () => void }) => {
  useEffect(() => {
    // Add a small delay to allow the loader to be visible
    const timer = setTimeout(() => {
      // Signal that loading is complete
      onLoaded();
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return null;
};

useGLTF.preload("/need_some_space.glb");

export default ThreeScene;
