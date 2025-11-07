import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import { GridHelper } from "three";

function TerrainLayer() {
  const grid = useMemo(() => new GridHelper(18, 36, 0x10b981, 0x1f2937), []);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18, 32, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <primitive object={grid} />
    </>
  );
}

function Marker({ label, position }: { label: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <coneGeometry args={[0.25, 0.9, 16]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial color="#0ea5e9" />
      </mesh>
      <Html position={[0, 0.6, 0]} center>
        <div className="px-2 py-1 rounded-full bg-white/80 text-xs font-semibold text-slate-700 shadow">{label}</div>
      </Html>
    </group>
  );
}

export default function Geo3DPage() {
  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-sky-400 font-semibold">Geografía 3D</p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Mapa interactivo</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Plano tridimensional de referencia para ubicar hitos, medir distancias aproximadas y explicar conceptos de latitud, longitud y relieve.
            Es un placeholder que servirá para proyectar modelos reales de territorio colombiano.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Ideas de uso</h2>
          <ul className="space-y-3 text-slate-600 dark:text-slate-300 text-sm">
            <li>• Ubicar capitales departamentales con marcadores 3D.</li>
            <li>• Medir distancias a escala entre dos puntos y discutir medios de transporte.</li>
            <li>• Superponer rutas migratorias o cadenas montañosas.</li>
            <li>• Preparar a los estudiantes para interpretar mapas digitales reales.</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden h-[480px]">
        <Canvas shadows>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.2} castShadow />
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[6, 5, 6]} fov={60} />
            <TerrainLayer />
            <Marker label="Bogotá" position={[1.5, 0.6, -0.8]} />
            <Marker label="Medellín" position={[0.4, 0.5, -1.3]} />
            <Marker label="Caribe" position={[2.2, 0.5, -2.2]} />
            <OrbitControls enablePan maxDistance={20} minDistance={4} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
