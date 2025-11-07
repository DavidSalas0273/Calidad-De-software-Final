import QuizEngine from "../../eval/QuizEngine";
import { math3dQuiz } from "../../eval/quizzes";

export default function EvaluationsPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.5em] text-emerald-400 font-semibold">Evaluaciones adaptativas</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Diagnóstico de Matemáticas 3D</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Responde el cuestionario para medir tu comprensión de los conceptos explorados en el módulo de Formas 3D. Obtendrás un puntaje entre 0 y 100
          y el sistema guardará tu progreso para el panel docente.
        </p>
      </header>

      <QuizEngine quiz={math3dQuiz} />
    </section>
  );
}
