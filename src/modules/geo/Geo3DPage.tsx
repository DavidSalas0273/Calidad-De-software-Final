import { useEffect, useRef, useState, type PointerEvent } from "react";

const colors = ["#FF9EB3", "#FFD166", "#4ADE80", "#60A5FA", "#A78BFA", "#F472B6", "#FACC15", "#34D399"];

function ToolbarButton({
  active,
  label,
  onClick,
  icon,
}: {
  active?: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center rounded-[28px] px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-600 shadow-sm"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="mt-1">{label}</span>
    </button>
  );
}

export default function Geo3DPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const [brushSize, setBrushSize] = useState(26);
  const [color, setColor] = useState(colors[0]);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.scale(ratio, ratio);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    };

    handleResize();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPosition = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    drawing.current = true;
    ctxRef.current.beginPath();
    const { x, y } = getPosition(event);
    ctxRef.current.moveTo(x, y);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drawStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const { x, y } = getPosition(event);
    ctx.lineWidth = tool === "brush" ? brushSize : brushSize * 1.8;
    ctx.strokeStyle = tool === "brush" ? color : "#ffffff";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    drawing.current = false;
    ctxRef.current.closePath();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const clear = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    ctxRef.current.fillStyle = "#ffffff";
    ctxRef.current.fillRect(0, 0, width, height);
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-pink-400 font-semibold">Mapa 3D a pintar</p>
          <h1 className="text-4xl font-bold text-slate-900">Pinta tu propio mapa en 3D</h1>
          <p className="text-lg text-slate-500">
            Reemplazamos el mapa tridimensional por un lienzo gigante y seguro. Todo está diseñado con botones grandes,
            colores suaves y herramientas fáciles de entender para que los pequeños artistas creen sin miedo.
          </p>
        </div>

        <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Herramientas amigables</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li>• Pincel gordito con control de grosor.</li>
            <li>• Borrador grande que limpia sin errores.</li>
            <li>• Paleta de colores pasteles seleccionados.</li>
            <li>• Botón de limpiar gigante para comenzar de nuevo.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-5 rounded-[40px] border border-slate-100 bg-slate-50/70 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row">
          <ToolbarButton active={tool === "brush"} label="Pincel" icon="🖌️" onClick={() => setTool("brush")} />
          <ToolbarButton active={tool === "eraser"} label="Borrador" icon="🧽" onClick={() => setTool("eraser")} />
          <ToolbarButton label="Limpiar" icon="🧼" onClick={clear} />
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-[28px] bg-white px-5 py-4 shadow-sm">
          <span className="text-sm font-semibold text-slate-500">Grosor</span>
          <input
            type="range"
            min={10}
            max={50}
            value={brushSize}
            onChange={(event) => setBrushSize(Number(event.target.value))}
            className="flex-1 accent-pink-400"
          />
          <span className="rounded-full bg-slate-900 px-4 py-1 text-sm font-semibold text-white">{brushSize}px</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {colors.map((item) => (
            <button
              key={item}
              aria-label={`Elegir color ${item}`}
              onClick={() => {
                setColor(item);
                setTool("brush");
              }}
              className={`h-12 flex-1 rounded-[28px] border-2 transition ${
                color === item ? "border-slate-900 scale-105" : "border-transparent"
              }`}
              style={{ backgroundColor: item }}
            />
          ))}
        </div>

        <div className="rounded-[32px] border-2 border-white bg-white shadow-inner">
          <canvas
            ref={canvasRef}
            className="h-[420px] w-full rounded-[32px]"
            onPointerDown={startStroke}
            onPointerMove={drawStroke}
            onPointerUp={endStroke}
            onPointerLeave={endStroke}
          />
        </div>

        <p className="text-center text-base font-semibold text-slate-500">
          ¡Usa tus dedos, el mouse o un lápiz para crear historias de colores!
        </p>
      </div>
    </section>
  );
}
