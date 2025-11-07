import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="max-w-4xl mx-auto text-center space-y-6 py-10">
      <p className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Laboratorio STEAM</p>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Explora Matemáticas y Ciencia en 3D</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300">
        Plataforma educativa con módulos interactivos de matemáticas, sistema solar y geografía 3D, evaluaciones
        adaptativas y panel docente para seguimiento del progreso.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-500 transition"
          to="/matematicas"
        >
          Ir a Matemáticas 3D
        </Link>
        <Link
          className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition"
          to="/login"
        >
          Iniciar sesión
        </Link>
      </div>
    </section>
  );
}
