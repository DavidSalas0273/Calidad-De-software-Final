interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="max-w-3xl mx-auto text-center p-10 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-900">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
      <p className="text-slate-600 dark:text-slate-300">
        {description ??
          "Este módulo estará disponible pronto. Estamos trabajando para traer experiencias inmersivas y evaluaciones inteligentes."}
      </p>
    </section>
  );
}
