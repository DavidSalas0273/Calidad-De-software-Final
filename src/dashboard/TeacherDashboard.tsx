import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const RESULTS_KEY = "quiz_results";

interface QuizResultRecord {
  quizId: string;
  quizTitle: string;
  moduleKey: string;
  moduleTitle: string;
  score: number;
  submittedAt: string;
  userId: string;
  userName: string;
}

type QuizStorage = Record<string, QuizResultRecord[]>;

const defaultModules = [
  { moduleKey: "matematicas", moduleTitle: "Matemáticas 3D" },
  { moduleKey: "sistema-solar", moduleTitle: "Sistema Solar" },
  { moduleKey: "mapa-3d", moduleTitle: "Mapa 3D" },
];

const readAllResults = (): QuizResultRecord[] => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(RESULTS_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuizStorage;
    return Object.values(parsed).flat();
  } catch {
    return [];
  }
};

export default function TeacherDashboard() {
  const [records, setRecords] = useState<QuizResultRecord[]>(() => readAllResults());

  useEffect(() => {
    const refresh = () => setRecords(readAllResults());
    window.addEventListener("quiz:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("quiz:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const moduleStats = useMemo(() => {
    const base = new Map<string, { title: string; total: number; count: number }>();
    defaultModules.forEach((module) => base.set(module.moduleKey, { title: module.moduleTitle, total: 0, count: 0 }));

    records.forEach((record) => {
      const stats = base.get(record.moduleKey) ?? { title: record.moduleTitle, total: 0, count: 0 };
      stats.total += record.score;
      stats.count += 1;
      base.set(record.moduleKey, stats);
    });

    return Array.from(base.entries()).map(([moduleKey, stats]) => ({
      moduleKey,
      moduleTitle: stats.title,
      average: stats.count ? parseFloat((stats.total / stats.count).toFixed(1)) : 0,
      submissions: stats.count,
    }));
  }, [records]);

  const latestSubmissions = useMemo(
    () =>
      [...records]
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 6),
    [records]
  );

  return (
    <section className="space-y-10">
      <header className="space-y-4 text-center max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-[0.6em] text-slate-400 font-semibold">Dashboard docente</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Progreso por módulo</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Visualiza el promedio de puntajes de los cuestionarios y revisa los últimos envíos realizados por los estudiantes. La gráfica se actualiza
          automáticamente cuando se registran nuevos resultados.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">Promedio general</p>
              <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                {moduleStats.length
                  ? (
                      moduleStats.reduce((acc, module) => acc + module.average, 0) / moduleStats.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <p className="text-sm text-slate-500">{records.length} envíos registrados</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="moduleTitle" tick={{ fill: "#94a3b8" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(value: number) => [`${value}`, "Promedio"]}
                  labelFormatter={(label) => label}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #1e293b", color: "white" }}
                />
                <Bar dataKey="average" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Últimas entregas</h2>
          <div className="space-y-4">
            {latestSubmissions.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay resultados almacenados.</p>
            ) : (
              latestSubmissions.map((submission) => (
                <div key={`${submission.quizId}-${submission.submittedAt}-${submission.userId}`} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-none">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{submission.userName}</p>
                    <p className="text-xs text-slate-500">
                      {submission.moduleTitle} · {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-emerald-500">{submission.score}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
