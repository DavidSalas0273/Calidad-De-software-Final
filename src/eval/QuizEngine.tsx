import { FormEvent, useEffect, useMemo, useState } from "react";
import { QuizDefinition } from "./quizzes";
import { useAuth } from "../context/AuthContext";

interface QuizEngineProps {
  quiz: QuizDefinition;
}

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

const safeLocalStorage = () => (typeof window === "undefined" ? undefined : window.localStorage);

const readResults = (): QuizStorage => {
  try {
    const storage = safeLocalStorage();
    if (!storage) return {};
    const raw = storage.getItem(RESULTS_KEY);
    return raw ? (JSON.parse(raw) as QuizStorage) : {};
  } catch {
    return {};
  }
};

const persistResults = (data: QuizStorage) => {
  const storage = safeLocalStorage();
  if (!storage) return;
  storage.setItem(RESULTS_KEY, JSON.stringify(data));
};

export default function QuizEngine({ quiz }: QuizEngineProps) {
  const { currentUser } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userKey = currentUser?.id ?? "anon";

  useEffect(() => {
    const data = readResults();
    const latestAttempt = data[userKey]?.filter((entry) => entry.quizId === quiz.quizId).at(-1);
    if (latestAttempt) {
      setScore(latestAttempt.score);
      setSubmittedAt(latestAttempt.submittedAt);
      setMessage("Resultado guardado de tu último intento.");
    }
  }, [quiz.quizId, userKey]);

  const completion = useMemo(() => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / quiz.questions.length) * 100);
  }, [answers, quiz.questions.length]);

  const handleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (Object.keys(answers).length !== quiz.questions.length) {
      setError("Responde todas las preguntas para calcular tu puntaje.");
      return;
    }

    setLoading(true);

    const correctCount = quiz.questions.reduce(
      (acc, question) => acc + (answers[question.id] === question.answer ? 1 : 0),
      0
    );
    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    const timestamp = new Date().toISOString();

    setScore(finalScore);
    setSubmittedAt(timestamp);
    setMessage(finalScore >= 70 ? "¡Excelente! Dominas el contenido." : "Necesitas reforzar algunos conceptos.");

    const data = readResults();
    const record: QuizResultRecord = {
      quizId: quiz.quizId,
      quizTitle: quiz.title,
      moduleKey: quiz.moduleKey,
      moduleTitle: quiz.moduleTitle,
      score: finalScore,
      submittedAt: timestamp,
      userId: userKey,
      userName: currentUser?.nombre ?? "Invitado",
    };
    const updatedRecords = [...(data[userKey] ?? []), record];
    data[userKey] = updatedRecords;
    persistResults(data);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("quiz:updated"));
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-400 font-semibold">{quiz.moduleTitle}</p>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{quiz.title}</h2>
        <p className="text-slate-600 dark:text-slate-300">{quiz.description}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Progreso respondido</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{completion}%</p>
        </div>
        {score !== null && (
          <div className="text-right">
            <p className="text-sm text-slate-500">Puntaje más reciente</p>
            <p className="text-2xl font-semibold text-emerald-500">{score}</p>
          </div>
        )}
      </section>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <fieldset key={question.id} className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900">
            <legend className="text-sm text-slate-500">Pregunta {index + 1}</legend>
            <p className="text-lg font-medium text-slate-900 dark:text-white">{question.prompt}</p>
            {question.hint && <p className="text-sm text-slate-500">Pista: {question.hint}</p>}
            <div className="grid gap-3">
              {question.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition ${
                    answers[question.id] === option
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleSelect(question.id, option)}
                    className="accent-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-200">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {message && (
        <p className="text-sm text-emerald-500">
          {message} {submittedAt && `(${new Date(submittedAt).toLocaleString()})`}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition disabled:opacity-60"
      >
        {loading ? "Calculando..." : "Enviar respuestas"}
      </button>
    </form>
  );
}
