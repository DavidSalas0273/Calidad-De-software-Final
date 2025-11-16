import { Link } from "react-router-dom";

const doodles = [
  { icon: "🎨", text: "Pinta sin límites", color: "from-pink-200 to-pink-100", animation: "animate-bounce" },
  { icon: "🪐", text: "Viaja por el espacio", color: "from-amber-200 to-amber-100", animation: "animate-pulse" },
  { icon: "📐", text: "Descubre formas", color: "from-sky-200 to-blue-100", animation: "animate-bounce" },
  { icon: "💡", text: "Idea brillante", color: "from-lime-200 to-lime-100", animation: "animate-pulse" },
];

const storyCards = [
  { title: "Historias estelares", description: "Personajes sonrientes te cuentan cuentos sobre planetas y estrellas.", icon: "✨" },
  { title: "Matemagia 3D", description: "Formas gigantes que se mueven, cambian de color y giran muy lento.", icon: "🔺" },
  { title: "Lienzo seguro", description: "Colores suaves, botones enormes y espacio para dibujar con dedos curiosos.", icon: "🖌️" },
];

export default function LandingPage() {
  return (
    <section className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Laboratorio Mini STEAM</p>
            <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              ¡Hola exploradores curiosos!
              <span className="block text-transparent bg-gradient-to-r from-pink-500 via-sky-500 to-emerald-500 bg-clip-text">
                Dibujen, jueguen y sueñen
              </span>
            </h1>
            <p className="text-lg text-slate-500 sm:text-xl">
              Una sala luminosa llena de figuras brillantes, planetas gigantes y un lienzo amistoso para que las manos pequeñas
              creen historias coloridas.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Seguro", "Divertido", "Interactivo"].map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                >
                  {label}
                </span>
              ))}
            </div>

            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
            >
              Entrar como guía
            </Link>
          </div>

          <div className="relative h-[360px] rounded-[40px] bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl">
            <div className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-br from-sky-50 to-pink-50 blur-3xl" />
            <div className="grid grid-cols-2 gap-4">
              {doodles.map((item) => (
                <div
                  key={item.text}
                  className={`h-40 rounded-[32px] bg-gradient-to-br ${item.color} p-4 text-center shadow ${item.animation}`}
                >
                  <p className="text-4xl">{item.icon}</p>
                  <p className="mt-3 text-base font-semibold text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute -bottom-6 right-6 hidden rounded-[28px] bg-white/90 px-5 py-3 text-lg font-bold text-slate-600 shadow-lg lg:flex">
              🌈 ¡Nuevo lienzo mágico!
            </div>
          </div>
        </div>

        <div className="rounded-[40px] border border-slate-100 bg-white p-8 shadow-lg">
          <h2 className="text-center text-3xl font-bold text-slate-900">Un mundo suave para aprender</h2>
          <p className="mt-3 text-center text-slate-500">
            Cada módulo tiene botones enormes, colores brillantes y acciones simples para que los pequeños exploren con seguridad.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {storyCards.map((card) => (
              <div key={card.title} className="rounded-[32px] border border-slate-100 bg-slate-50/60 p-6 text-center shadow-sm">
                <p className="text-4xl">{card.icon}</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
