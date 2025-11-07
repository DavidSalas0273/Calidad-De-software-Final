import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function SpinningCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.6;
    meshRef.current.rotation.y += delta * 0.8;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial color="#34d399" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

export default function Math3DPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Matemáticas inmersivas</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Formas 3D</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Manipula un cubo en tiempo real para comprender volumen, caras, vértices y transformaciones espaciales. Usa el
          mouse o el tacto para orbitar, hacer zoom y observar el modelo desde cualquier ángulo.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Ficha pedagógica</h2>
        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
          <li>• Identifica caras, aristas y vértices.</li>
          <li>• Relaciona rotaciones con ejes cartesianos.</li>
          <li>• Calcula área y volumen en figuras compuestas.</li>
          <li>• Apoya sesiones de geometría para grados 6° - 9°.</li>
        </ul>
      </div>

      <div className="lg:col-span-2 bg-slate-900 rounded-3xl shadow-2xl overflow-hidden h-[500px]">
        <Canvas shadows>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={50} />
            <SpinningCube />
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <OrbitControls enablePan={false} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
