import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import type { Mesh } from "three";

interface PlanetConfig {
  name: string;
  color: string;
  distance: number;
  size: number;
  speed: number;
  description: string;
  hasRing?: boolean;
}

const planetData: PlanetConfig[] = [
  { name: "Mercurio", color: "#c4b7a6", distance: 2.5, size: 0.25, speed: 1.8, description: "Planeta rocoso cercano al Sol." },
  { name: "Venus", color: "#e5c07b", distance: 3.2, size: 0.35, speed: 1.5, description: "Denso, con atmósfera cargada." },
  { name: "Tierra", color: "#4fc3f7", distance: 4.1, size: 0.36, speed: 1.2, description: "Único hogar con vida confirmada." },
  { name: "Marte", color: "#ef5350", distance: 4.8, size: 0.3, speed: 1, description: "Planeta rojo con volcanes gigantes." },
  { name: "Júpiter", color: "#f48fb1", distance: 6.2, size: 0.8, speed: 0.6, description: "Gigante gaseoso con Gran Mancha Roja." },
  { name: "Saturno", color: "#fdd835", distance: 7.4, size: 0.7, speed: 0.5, description: "Famoso por sus anillos brillantes.", hasRing: true },
  { name: "Urano", color: "#80cbc4", distance: 8.4, size: 0.5, speed: 0.35, description: "Gira prácticamente de lado." },
  { name: "Neptuno", color: "#5c6bc0", distance: 9.2, size: 0.5, speed: 0.28, description: "Vientos más rápidos del sistema solar." },
];

function Planet({ config }: { config: PlanetConfig }) {
  const meshRef = useRef<Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    angleRef.current += config.speed * delta * 0.3;
    const x = Math.cos(angleRef.current) * config.distance;
    const z = Math.sin(angleRef.current) * config.distance;
    meshRef.current.position.set(x, 0, z);
    meshRef.current.rotation.y += delta * 0.4;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[config.size, 32, 32]} />
      <meshStandardMaterial color={config.color} />
      {config.hasRing && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[config.size * 1.6, config.size * 2.7, 64]} />
          <meshBasicMaterial color="#fdd835" transparent opacity={0.7} side={2} />
        </mesh>
      )}
    </mesh>
  );
}

function OrbitPath({ radius }: { radius: number }) {
  const positions = useMemo(() => {
    const segments = 128;
    const coords: number[] = [];
    for (let i = 0; i <= segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      coords.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    }
    return new Float32Array(coords);
  }, [radius]);

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#1f2937" />
    </lineLoop>
  );
}

export default function SolarPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetConfig | null>(null);

  const speakPlanetInfo = useCallback((planet: PlanetConfig) => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(`${planet.name}. ${planet.description}`);
    utterance.lang = "es-ES";
    synth.cancel();
    synth.speak(utterance);
  }, []);

  const handlePlanetSelect = useCallback(
    (planet: PlanetConfig) => {
      setSelectedPlanet(planet);
      speakPlanetInfo(planet);
    },
    [speakPlanetInfo],
  );

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-amber-400 font-semibold">Sistema Solar</p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Recorrido Planetario</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Observa órbitas y proporciones aproximadas de los ocho planetas principales alrededor del Sol. Haz zoom y orbita para explicar
            conceptos como años planetarios, distancia al Sol y tipos de planetas (rocosos y gaseosos).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Ficha didáctica</h2>
          <ul className="space-y-3 text-slate-600 dark:text-slate-300 text-sm">
            <li>• Contar años escolares con el concepto de traslación.</li>
            <li>• Distinguir entre planetas interiores y exteriores.</li>
            <li>• Analizar el tamaño relativo frente al planeta Tierra.</li>
            <li>• Identificar elementos característicos como anillos y atmósferas.</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden h-[520px]">
          <Canvas shadows>
            <color attach="background" args={["#020617"]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#fff1c1" />
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[10, 6, 10]} fov={55} />
              <mesh>
                <sphereGeometry args={[1.2, 48, 48]} />
                <meshStandardMaterial emissive="#ffd166" emissiveIntensity={2} color="#fbbf24" />
              </mesh>
              {planetData.map((planet) => (
                <group key={planet.name}>
                  <OrbitPath radius={planet.distance} />
                  <Planet config={planet} />
                </group>
              ))}
              <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
              <OrbitControls enablePan={false} maxDistance={25} minDistance={5} />
            </Suspense>
          </Canvas>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Datos rápidos de los planetas</h3>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {planetData.map((planet) => {
              const isSelected = selectedPlanet?.name === planet.name;
              return (
                <li key={planet.name} className="py-1.5">
                  <button
                    type="button"
                    onClick={() => handlePlanetSelect(planet)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${
                      isSelected
                        ? "bg-amber-50 ring-2 ring-amber-300 dark:bg-slate-800/70 dark:ring-amber-200"
                        : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full mt-1.5" style={{ backgroundColor: planet.color }} />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{planet.name}</p>
                      <p className="text-sm text-slate-500">{planet.description}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

