import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Matemáticas 3D", href: "/matematicas" },
  { label: "Sistema Solar", href: "/sistema-solar" },
  { label: "Mapa 3D", href: "/mapa-3d" },
  { label: "Evaluaciones", href: "/evaluaciones" },
  { label: "Dashboard Docente", href: "/dashboard" },
  { label: "Acceso", href: "/login" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved) {
      root.classList.toggle("dark", saved === "dark");
      return;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.classList.toggle("dark") ? "dark" : "light";
    localStorage.setItem("theme", next);
    document.dispatchEvent(new CustomEvent("theme:changed", { detail: { theme: next } }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition ${
      isActive
        ? "bg-emerald-600 text-white shadow"
        : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white font-bold grid place-items-center">STEAM</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">UCC</p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Laboratorio Inmersivo</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className={linkStyles}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:inline-flex px-3 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-500"
            >
              Tema
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm text-slate-600 dark:text-slate-300">
                  {currentUser.nombre} · {currentUser.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 dark:bg-white/10 dark:text-white"
                >
                  Salir
                </button>
              </div>
            ) : (
              <span className="hidden sm:block text-sm text-slate-500">Modo invitado</span>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-300 dark:border-slate-700"
              aria-label="Abrir menú"
            >
              <span className="sr-only">Abrir menú</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-slate-800 dark:bg-slate-200" />
                <span className="block h-0.5 w-5 bg-slate-800 dark:bg-slate-200" />
                <span className="block h-0.5 w-5 bg-slate-800 dark:bg-slate-200" />
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className={linkStyles} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
