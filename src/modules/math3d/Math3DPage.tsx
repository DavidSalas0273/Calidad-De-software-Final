import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Mesh } from "three";

type ShapeKind = "cube" | "sphere" | "pyramid" | "prism" | "cylinder" | "donut";

const shapeOptions: Array<{ id: ShapeKind; label: string; icon: string }> = [
  { id: "cube", label: "Cubito", icon: "🧊" },
  { id: "sphere", label: "Bola", icon: "🟣" },
  { id: "pyramid", label: "Pirámide", icon: "🔺" },
  { id: "prism", label: "Prisma", icon: "🔷" },
  { id: "cylinder", label: "Cilindro", icon: "🪩" },
  { id: "donut", label: "Rosquilla", icon: "🍩" },
];

const friendlyColors = ["#F472B6", "#60A5FA", "#FCD34D", "#34D399", "#A78BFA", "#FB7185"];

type TetrominoKey = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

type TetrominoDefinition = {
  color: string;
  rotations: Array<Array<[number, number]>>;
};

const TETROMINOES: Record<TetrominoKey, TetrominoDefinition> = {
  I: {
    color: "#60A5FA",
    rotations: [
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    ],
  },
  J: {
    color: "#1D4ED8",
    rotations: [
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, -1],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [-1, 0],
        [-1, 1],
        [0, 0],
        [1, 0],
      ],
      [
        [-1, -1],
        [0, -1],
        [0, 0],
        [0, 1],
      ],
    ],
  },
  L: {
    color: "#F97316",
    rotations: [
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [-1, -1],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [1, -1],
      ],
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, 1],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [-1, 1],
      ],
    ],
  },
  O: {
    color: "#FACC15",
    rotations: [
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    ],
  },
  S: {
    color: "#34D399",
    rotations: [
      [
        [-1, 0],
        [0, 0],
        [0, -1],
        [1, -1],
      ],
      [
        [0, -1],
        [0, 0],
        [1, 0],
        [1, 1],
      ],
    ],
  },
  T: {
    color: "#A855F7",
    rotations: [
      [
        [-1, 0],
        [0, 0],
        [0, -1],
        [1, 0],
      ],
      [
        [0, -1],
        [0, 0],
        [1, 0],
        [0, 1],
      ],
      [
        [-1, 0],
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      [
        [0, -1],
        [-1, 0],
        [0, 0],
        [0, 1],
      ],
    ],
  },
  Z: {
    color: "#F43F5E",
    rotations: [
      [
        [-1, -1],
        [0, -1],
        [0, 0],
        [1, 0],
      ],
      [
        [1, -1],
        [1, 0],
        [0, 0],
        [0, 1],
      ],
    ],
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

type CellValue = string | null;
type ActivePiece = {
  shape: TetrominoKey;
  rotation: number;
  position: { x: number; y: number };
};

const createEmptyBoard = (): CellValue[][] => Array.from({ length: BOARD_HEIGHT }, () => Array<CellValue>(BOARD_WIDTH).fill(null));

function FriendlyShape({ type, color, wobble, spinSpeed }: { type: ShapeKind; color: string; wobble: boolean; spinSpeed: number }) {
  const meshRef = useRef<Mesh>(null);
  const wobbleRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * spinSpeed;
    meshRef.current.rotation.y += delta * (spinSpeed + 0.2);
    if (wobble) {
      wobbleRef.current += delta;
      meshRef.current.position.y = Math.sin(wobbleRef.current * 2) * 0.2;
    }
  });

  let geometry: ReactNode = null;
  switch (type) {
    case "cube":
      geometry = <boxGeometry args={[1.8, 1.8, 1.8]} />;
      break;
    case "sphere":
      geometry = <sphereGeometry args={[1.5, 42, 42]} />;
      break;
    case "pyramid":
      geometry = <coneGeometry args={[1.7, 2.2, 4]} />;
      break;
    case "prism":
      geometry = <coneGeometry args={[1.5, 2.5, 6]} />;
      break;
    case "cylinder":
      geometry = <cylinderGeometry args={[1.1, 1.1, 2.4, 32]} />;
      break;
    case "donut":
      geometry = <torusGeometry args={[1.2, 0.45, 32, 64]} />;
      break;
    default:
      geometry = <boxGeometry args={[1.8, 1.8, 1.8]} />;
  }

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {geometry}
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
    </mesh>
  );
}

function OrbitingBuddy({ radius, color, speed = 1.2 }: { radius: number; color: string; speed?: number }) {
  const buddyRef = useRef<Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!buddyRef.current) return;
    angleRef.current += delta * speed;
    buddyRef.current.position.set(Math.cos(angleRef.current) * radius, Math.sin(angleRef.current * 2) * 0.5, Math.sin(angleRef.current) * radius);
  });

  return (
    <mesh ref={buddyRef} castShadow>
      <sphereGeometry args={[0.2, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  );
}

function getRandomShape(): TetrominoKey {
  const keys = Object.keys(TETROMINOES) as TetrominoKey[];
  return keys[Math.floor(Math.random() * keys.length)];
}

function getPieceCells(piece: ActivePiece, rotationOverride?: number) {
  const rotationSet = TETROMINOES[piece.shape].rotations;
  const rotation = rotationSet[(rotationOverride ?? piece.rotation) % rotationSet.length];
  return rotation.map(([x, y]) => ({ x: piece.position.x + x, y: piece.position.y + y }));
}

function useMusicController() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const melodyTimerRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);
  const notes = useRef([523.25, 659.25, 783.99, 659.25, 587.33, 659.25]);

  const stopMusic = useCallback(() => {
    if (melodyTimerRef.current) {
      clearInterval(melodyTimerRef.current);
      melodyTimerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend().catch(() => {});
    }
  }, []);

  const startMusic = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    if (melodyTimerRef.current) return;
    noteIndexRef.current = 0;
    const playNote = () => {
      if (!ctx || ctx.state !== "running") return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = notes.current[noteIndexRef.current % notes.current.length];
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      noteIndexRef.current = (noteIndexRef.current + 1) % notes.current.length;
    };
    melodyTimerRef.current = window.setInterval(playNote, 500);
  }, []);

  useEffect(() => () => stopMusic(), [stopMusic]);

  return { startMusic, stopMusic };
}

function TetrisGame() {
  const [board, setBoard] = useState<CellValue[][]>(() => createEmptyBoard());
  const [activePiece, setActivePiece] = useState<ActivePiece>(() => ({
    shape: getRandomShape(),
    rotation: 0,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
  }));
  const [nextShape, setNextShape] = useState<TetrominoKey>(() => getRandomShape());
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const dropSpeed = useMemo(() => Math.max(300, 900 - linesCleared * 20), [linesCleared]);
  const { startMusic, stopMusic } = useMusicController();

  const boardWithPiece = useMemo(() => {
    const snapshot = board.map((row) => [...row]);
    getPieceCells(activePiece).forEach(({ x, y }) => {
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        snapshot[y][x] = TETROMINOES[activePiece.shape].color;
      }
    });
    return snapshot;
  }, [board, activePiece]);

  const checkCollision = useCallback(
    (piece: ActivePiece, offsetX: number, offsetY: number, rotationDelta = 0) => {
      const rotationSet = TETROMINOES[piece.shape].rotations;
      const nextRotation = (piece.rotation + rotationDelta + rotationSet.length) % rotationSet.length;
      const cells = getPieceCells(piece, nextRotation);
      return cells.some(({ x, y }) => {
        const testX = x + offsetX;
        const testY = y + offsetY;
        return testX < 0 || testX >= BOARD_WIDTH || testY >= BOARD_HEIGHT || (testY >= 0 && board[testY][testX]);
      });
    },
    [board],
  );

  const mergePieceIntoBoard = useCallback(
    (piece: ActivePiece) => {
      const newBoard = board.map((row) => [...row]);
      getPieceCells(piece).forEach(({ x, y }) => {
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          newBoard[y][x] = TETROMINOES[piece.shape].color;
        }
      });
      return newBoard;
    },
    [board],
  );

  const clearCompletedLines = (currentBoard: CellValue[][]) => {
    let cleared = 0;
    const newBoard = currentBoard.map((row) => [...row]);
    for (let row = BOARD_HEIGHT - 1; row >= 0; row -= 1) {
      if (newBoard[row].every((cell) => cell)) {
        newBoard.splice(row, 1);
        newBoard.unshift(Array<CellValue>(BOARD_WIDTH).fill(null));
        cleared += 1;
        row += 1;
      }
    }
    return { newBoard, cleared };
  };

  const spawnNewPiece = useCallback(
    (incomingShape?: TetrominoKey) => ({
      shape: incomingShape ?? getRandomShape(),
      rotation: 0,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    }),
    [],
  );

  const dropPiece = useCallback(() => {
    if (checkCollision(activePiece, 0, 1)) {
      const merged = mergePieceIntoBoard(activePiece);
      const { newBoard, cleared } = clearCompletedLines(merged);
      if (cleared > 0) {
        setLinesCleared((prev) => prev + cleared);
        setScore((prev) => prev + cleared * 150);
      }
      setBoard(newBoard);
      const next = spawnNewPiece(nextShape);
      if (checkCollision(next, 0, 0)) {
        setIsGameOver(true);
        setIsPlaying(false);
        stopMusic();
      } else {
        setActivePiece(next);
        setNextShape(getRandomShape());
      }
    } else {
      setActivePiece((prev) => ({ ...prev, position: { x: prev.position.x, y: prev.position.y + 1 } }));
    }
  }, [activePiece, checkCollision, mergePieceIntoBoard, nextShape, spawnNewPiece, stopMusic]);

  const movePiece = useCallback(
    (direction: "left" | "right") => {
      if (!isPlaying || isGameOver) return;
      const offset = direction === "left" ? -1 : 1;
      if (!checkCollision(activePiece, offset, 0)) {
        setActivePiece((prev) => ({ ...prev, position: { x: prev.position.x + offset, y: prev.position.y } }));
      }
    },
    [activePiece, checkCollision, isGameOver, isPlaying],
  );

  const rotatePiece = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    if (!checkCollision(activePiece, 0, 0, 1)) {
      setActivePiece((prev) => ({ ...prev, rotation: (prev.rotation + 1) % TETROMINOES[prev.shape].rotations.length }));
    }
  }, [activePiece, checkCollision, isGameOver, isPlaying]);

  const hardDrop = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    let dropCount = 0;
    while (!checkCollision(activePiece, 0, dropCount + 1)) {
      dropCount += 1;
    }
    if (dropCount > 0) {
      setActivePiece((prev) => ({ ...prev, position: { x: prev.position.x, y: prev.position.y + dropCount } }));
    }
    setScore((prev) => prev + dropCount * 5);
    dropPiece();
  }, [activePiece, checkCollision, dropPiece, isGameOver, isPlaying]);

  const startGame = () => {
    setBoard(createEmptyBoard());
    const firstShape = getRandomShape();
    setActivePiece(spawnNewPiece(firstShape));
    setNextShape(getRandomShape());
    setScore(0);
    setLinesCleared(0);
    setIsGameOver(false);
    setIsPlaying(true);
    if (musicEnabled) {
      startMusic();
    }
  };

  const togglePause = () => {
    if (isGameOver) return;
    setIsPlaying((prev) => {
      if (prev) {
        stopMusic();
      } else {
        if (musicEnabled) {
          startMusic();
        }
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return undefined;
    const interval = setInterval(() => {
      dropPiece();
    }, dropSpeed);
    return () => clearInterval(interval);
  }, [dropPiece, dropSpeed, isGameOver, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "w", "a", "d", "s"].includes(event.key)) {
        event.preventDefault();
      }
      if (event.key === "ArrowLeft" || event.key === "a") movePiece("left");
      if (event.key === "ArrowRight" || event.key === "d") movePiece("right");
      if (event.key === "ArrowUp" || event.key === "w") rotatePiece();
      if (event.key === "ArrowDown" || event.key === "s") dropPiece();
      if (event.key === " ") hardDrop();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dropPiece, hardDrop, isGameOver, isPlaying, movePiece, rotatePiece]);

  useEffect(() => {
    if (!isPlaying || isGameOver) {
      stopMusic();
    }
  }, [isGameOver, isPlaying, stopMusic]);

  useEffect(() => {
    if (!musicEnabled) {
      stopMusic();
    } else if (musicEnabled && isPlaying && !isGameOver) {
      startMusic();
    }
  }, [musicEnabled, isPlaying, isGameOver, startMusic, stopMusic]);

  const nextPiecePreview = useMemo(() => {
    const previewBoard = Array.from({ length: 4 }, () => Array<CellValue>(4).fill(null));
    TETROMINOES[nextShape].rotations[0].forEach(([x, y]) => {
      const previewX = x + 2;
      const previewY = y + 2;
      if (previewX >= 0 && previewX < 4 && previewY >= 0 && previewY < 4) {
        previewBoard[previewY][previewX] = TETROMINOES[nextShape].color;
      }
    });
    return previewBoard;
  }, [nextShape]);

  return (
    <div className="space-y-6 rounded-[36px] border border-slate-100 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Juego interactivo</p>
          <h3 className="text-2xl font-bold text-slate-900">Mini Tetrix musical</h3>
          <p className="text-sm text-slate-500">Mueve las piezas con las flechas o las teclas WASD, gira con flecha arriba y cae rápido con espacio.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={startGame}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:-translate-y-0.5 disabled:bg-slate-400"
          >
            {isGameOver ? "Jugar de nuevo" : "Iniciar"}
          </button>
          <button
            onClick={togglePause}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm disabled:bg-slate-200"
            disabled={!isPlaying && !isGameOver}
          >
            {isPlaying ? "Pausa" : "Reanudar"}
          </button>
          <button
            onClick={() => setMusicEnabled((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
              musicEnabled ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
            }`}
          >
            {musicEnabled ? "Silenciar música" : "Activar música"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-[28px] bg-slate-900 p-4 shadow-inner">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0,1fr))` }}>
            {boardWithPiece.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className="h-7 w-full rounded-sm border border-slate-900/80"
                  style={{ backgroundColor: cell ?? "rgba(255,255,255,0.05)" }}
                />
              )),
            )}
          </div>
          {isGameOver && <p className="mt-4 rounded-2xl bg-white/10 py-2 text-center text-lg font-semibold text-white">¡Juego terminado!</p>}
        </div>

        <div className="space-y-4 rounded-[28px] border border-slate-100 bg-slate-50/80 p-4 text-center shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500">Puntuación</p>
            <p className="text-3xl font-bold text-slate-900">{score}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Líneas</p>
            <p className="text-2xl font-bold text-slate-900">{linesCleared}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Pieza siguiente</p>
            <div className="mt-2 grid grid-cols-4 gap-1 rounded-2xl bg-white/70 p-3">
              {nextPiecePreview.map((row, rowIndex) =>
                row.map((cell, cellIndex) => (
                  <div key={`${rowIndex}-${cellIndex}`} className="h-6 rounded-md border border-slate-200" style={{ backgroundColor: cell ?? "transparent" }} />
                )),
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500">La música se detiene si pones pausa o terminas la partida.</p>
        </div>
      </div>
    </div>
  );
}

export default function Math3DPage() {
  const [shape, setShape] = useState<ShapeKind>("cube");
  const [color, setColor] = useState(friendlyColors[0]);
  const [spinSpeed, setSpinSpeed] = useState(0.7);
  const [wobble, setWobble] = useState(true);
  const [showBuddies, setShowBuddies] = useState(true);

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 font-semibold">Matemática 3D</p>
          <h1 className="text-4xl font-bold text-slate-900">Figuras vivas para jugar</h1>
          <p className="text-lg text-slate-500">
            Selecciona cubos, esferas, prismas y más figuras alegres. Cambia colores brillantes, ajusta la velocidad de giro y enciende pequeños
            compañeros que orbitan el modelo principal. Todo está pensado para ser manipulado con un dedo.
          </p>
        </div>
        <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Ideas para trabajar</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li>• Identifica caras, vértices y aristas resaltando cada figura.</li>
            <li>• Compara cuerpos geométricos cambiando entre prismas y cilindros.</li>
            <li>• Habla de simetría activando los amigos orbitales.</li>
            <li>• Calcula volumen jugando con la velocidad de giro.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-5 rounded-[40px] border border-slate-100 bg-slate-50/70 p-6 shadow-lg">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {shapeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setShape(option.id)}
              className={`rounded-[28px] px-4 py-4 text-center text-sm font-semibold transition ${
                shape === option.id ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              <span className="block text-2xl">{option.icon}</span>
              <span className="mt-1 block">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {friendlyColors.map((item) => (
            <button
              key={item}
              aria-label={`Color ${item}`}
              onClick={() => setColor(item)}
              className={`h-12 flex-1 rounded-[26px] border-2 transition ${color === item ? "border-slate-900 scale-105" : "border-transparent"}`}
              style={{ backgroundColor: item }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 rounded-[28px] bg-white px-5 py-4 shadow-sm">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-500">Velocidad</p>
            <input
              type="range"
              min={0.2}
              max={1.4}
              step={0.1}
              value={spinSpeed}
              onChange={(event) => setSpinSpeed(Number(event.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 text-sm font-semibold text-slate-600">
            <label className="flex items-center justify-between rounded-[24px] bg-slate-50 px-3 py-2">
              <span>Movimiento suave</span>
              <input type="checkbox" checked={wobble} onChange={(event) => setWobble(event.target.checked)} className="accent-pink-400 h-5 w-5" />
            </label>
            <label className="flex items-center justify-between rounded-[24px] bg-slate-50 px-3 py-2">
              <span>Compañeros orbitando</span>
              <input type="checkbox" checked={showBuddies} onChange={(event) => setShowBuddies(event.target.checked)} className="accent-sky-400 h-5 w-5" />
            </label>
          </div>
        </div>

        <div className="h-[480px] overflow-hidden rounded-[36px] border-2 border-white bg-white shadow-inner">
          <Canvas shadows>
            <color attach="background" args={["#F8FAFC"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[6, 6, 4]} intensity={1.1} castShadow />
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[4.5, 3.6, 4.5]} fov={55} />
              <FriendlyShape type={shape} color={color} wobble={wobble} spinSpeed={spinSpeed} />
              {showBuddies && (
                <>
                  <OrbitingBuddy radius={2.8} color="#FDE047" speed={1.2} />
                  <OrbitingBuddy radius={2.2} color="#38BDF8" speed={1.6} />
                  <OrbitingBuddy radius={1.7} color="#F97316" speed={0.9} />
                </>
              )}
              <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
            </Suspense>
          </Canvas>
        </div>

        <p className="text-center text-base font-semibold text-slate-500">Gira, acerca y explora la figura favorita.</p>
      </div>

      <TetrisGame />
    </section>
  );
}
