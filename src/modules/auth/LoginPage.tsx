import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/matematicas");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrió un error al iniciar sesión.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-6">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-wide text-emerald-500 font-semibold">Acceso seguro</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Iniciar sesión</h1>
        {currentUser && (
          <p className="text-sm text-slate-500">
            Sesión activa como <span className="font-semibold">{currentUser.nombre}</span>
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300 gap-1">
          Correo institucional
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="nombre@ucc.edu.co"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300 gap-1">
          Contraseña
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-center text-slate-600 dark:text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link className="text-emerald-600 font-semibold hover:underline" to="/register">
          Regístrate aquí
        </Link>
      </p>
    </section>
  );
}
