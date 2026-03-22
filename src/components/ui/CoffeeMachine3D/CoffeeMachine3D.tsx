"use client";

import { Component, ReactNode, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

type CoffeeMachine3DProps = {
  onError?: () => void;
  mode?: "background" | "inline";
};

type ErrorBoundaryProps = {
  children: ReactNode;
  onError?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ModelErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function CoffeeMachineModel({
  mode = "inline",
}: {
  mode?: "background" | "inline";
}) {
  const { scene } = useGLTF("/models/Rocket-Espresso.glb");

  if (mode === "background") {
    return (
      <primitive
        object={scene}
        scale={8}
        position={[-1.5, -2.4, -1]}
        rotation={[0.08, -0.9, 0]}
      />
    );
  }

  return (
    <primitive
      object={scene}
      scale={2.6}
      position={[-1.2, -2.2, 0]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
}

function CoffeeMachineScene({
  mode = "inline",
}: {
  mode?: "background" | "inline";
}) {
  const cameraProps =
    mode === "background"
      ? {
          position: [0, 1.6, 10] as [number, number, number],
          fov: 40,
        }
      : {
          position: [0, 1.2, 2.2] as [number, number, number],
          fov: 32,
        };

  return (
    <Canvas camera={cameraProps} dpr={[1, 2]}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.8} />
      <directionalLight position={[-4, 3, -2]} intensity={0.95} />
      <directionalLight position={[0, 6, 0]} intensity={0.7} />

      <CoffeeMachineModel mode={mode} />

      <OrbitControls
        autoRotate
        autoRotateSpeed={mode === "background" ? 0.8 : 1.2}
        enablePan={false}
        enableZoom={false}
      />
    </Canvas>
  );
}

function getWebGLSupport() {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const canvas = document.createElement("canvas");
    return (
      !!canvas.getContext("webgl") ||
      !!canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

useGLTF.preload("/models/Rocket-Espresso.glb");

export default function CoffeeMachine3D({
  onError,
  mode = "inline",
}: CoffeeMachine3DProps) {
  const isWebGLSupported = useMemo(() => getWebGLSupport(), []);

  if (!isWebGLSupported) {
    return null;
  }

  return (
    <div
      className={
        mode === "background"
          ? "h-full w-full"
          : "relative h-[320px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]"
      }
    >
      <ModelErrorBoundary onError={onError}>
        <CoffeeMachineScene mode={mode} />
      </ModelErrorBoundary>
    </div>
  );
}

// TODO: Auto-center model using bounding box so any new .glb fits perfectly.
// TODO: Add soft fade-in when model loads.
// TODO: Reduce DPR on weaker devices if performance drops.