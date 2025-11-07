import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../../context/AuthContext";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "estudiante", label: "Estudiante" },
  { value: "docente", label: "Docente" },
  { value: "admin", label: "Administrador" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    role: "estudiante" as UserRole,
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(form);
      navigate("/matematicas");
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo completar el registro.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-6">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-widest text-emerald-500 font-semibold">Crear cuenta</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Regístrate</h1>
        <p className="text-slate-500">Define tu rol para personalizar las experiencias y evaluaciones.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300 gap-1 md:col-span-2">
          Nombre completo
          <input
            type="text"
            name="nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Alexandra Torres"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300 gap-1 md:col-span-2">
          Correo institucional
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="nombre@ucc.edu.co"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300 gap-1">
          Rol
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {roleOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300 gap-1">
          Contraseña
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Min 6 caracteres"
          />
        </label>

        {error && <p className="text-sm text-red-500 md:col-span-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-sm text-center text-slate-600 dark:text-slate-400">
        ¿Ya tienes una cuenta?{" "}
        <Link className="text-emerald-600 font-semibold hover:underline" to="/login">
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}
