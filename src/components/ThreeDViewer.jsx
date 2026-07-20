import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, OrbitControls, useGLTF, Loader } from "@react-three/drei";
import * as THREE from "three";

const WALK_SPEED = 4; // meters/second
const EYE_HEIGHT = 1.6; // meters — fixed, assumes a flat floor

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function useKeyboardMove() {
  const move = useRef({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const keyMap = {
      KeyW: "forward",
      ArrowUp: "forward",
      KeyS: "backward",
      ArrowDown: "backward",
      KeyA: "left",
      ArrowLeft: "left",
      KeyD: "right",
      ArrowRight: "right",
    };
    function onDown(e) {
      const key = keyMap[e.code];
      if (key) move.current[key] = true;
    }
    function onUp(e) {
      const key = keyMap[e.code];
      if (key) move.current[key] = false;
    }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  return move;
}

function WalkControls({ onLockChange }) {
  const move = useKeyboardMove();
  const { camera } = useThree();
  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const moveVec = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 6);
  }, [camera]);

  useFrame((_, delta) => {
    const { forward, backward, left, right } = move.current;
    if (!forward && !backward && !left && !right) return;

    camera.getWorldDirection(forwardVec.current);
    forwardVec.current.y = 0;
    forwardVec.current.normalize();
    rightVec.current.crossVectors(forwardVec.current, camera.up).normalize();

    moveVec.current.set(0, 0, 0);
    if (forward) moveVec.current.add(forwardVec.current);
    if (backward) moveVec.current.sub(forwardVec.current);
    if (right) moveVec.current.add(rightVec.current);
    if (left) moveVec.current.sub(rightVec.current);

    if (moveVec.current.lengthSq() > 0) {
      moveVec.current.normalize().multiplyScalar(WALK_SPEED * delta);
      camera.position.add(moveVec.current);
      camera.position.y = EYE_HEIGHT;
    }
  });

  return <PointerLockControls onLock={() => onLockChange(true)} onUnlock={() => onLockChange(false)} />;
}

function isTouchDevice() {
  return typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
}

export default function ThreeDViewer({ modelUrl }) {
  const [locked, setLocked] = useState(false);
  const [touch] = useState(isTouchDevice);

  return (
    <div className="relative h-full w-full">
      <Canvas shadows camera={{ fov: 70, position: [0, EYE_HEIGHT, 6] }} onCreated={({ gl }) => gl.setClearColor("#0f1729")}>
        <fog attach="fog" args={["#0f1729", 8, 45]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        {touch ? (
          <OrbitControls enablePan={false} minDistance={2} maxDistance={30} target={[0, EYE_HEIGHT, 0]} />
        ) : (
          <WalkControls onLockChange={setLocked} />
        )}
      </Canvas>
      <Loader />

      {!touch && !locked && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 text-center text-white">
          <p className="text-lg font-semibold">Click to walk around</p>
          <p className="text-sm text-slate-300">WASD or arrow keys to move · mouse to look · Esc to exit</p>
        </div>
      )}
      {touch && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white">
          Drag to look around · pinch to zoom
        </div>
      )}
    </div>
  );
}

useGLTF.preload("/3d/Base_floor_model.glb");
