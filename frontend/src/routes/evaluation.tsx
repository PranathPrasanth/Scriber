import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { fetchEvaluation, type ModelAccuracy } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Model Evaluation — Gemini vs Gemma vs Nemotron | Scriber" },
      {
        name: "description",
        content:
          "Compare overall accuracy, bills evaluated and success rate for Gemini, Gemma and Nemotron on handwritten receipt extraction.",
      },
      { property: "og:title", content: "Scriber Model Evaluation" },
      {
        property: "og:description",
        content: "Accuracy benchmarks for Gemini, Gemma and Nemotron receipt extraction.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Evaluation,
});

function Ring({ value, label }: { value: number; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            strokeWidth="10"
            className="stroke-accent"
            strokeLinecap="round"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="url(#ringGradient)"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c - (value / 100) * c }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary-glow)" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 grid place-items-center text-2xl font-semibold tracking-tight">
          {value.toFixed(1)}%
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ModelCard({ m, i }: { m: ModelAccuracy; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="glass-card hover-lift flex flex-col items-center p-7 text-center"
    >
      <h2 className="text-lg font-semibold tracking-tight">{m.name} Accuracy</h2>
      <div className="mt-6">
        <Ring value={m.overall_accuracy} label="Overall accuracy" />
      </div>
      <dl className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="rounded-2xl border border-primary/10 bg-background/60 p-4">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Bills evaluated</dt>
          <dd className="mt-1 text-xl font-semibold">{m.bills_evaluated}</dd>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-background/60 p-4">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Success rate</dt>
          <dd className="mt-1 text-xl font-semibold">{m.success_rate.toFixed(1)}%</dd>
        </div>
      </dl>
    </motion.article>
  );
}

function Evaluation() {
  const { data, isLoading } = useQuery({ queryKey: ["evaluation"], queryFn: fetchEvaluation });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="animate-fade-up max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Model Evaluation</h1>
        <p className="mt-2 text-muted-foreground">
          Benchmarked on the same handwritten receipt set — accuracy, volume and success rate per
          vision language model.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[26rem] rounded-3xl" />
            ))
          : data?.map((m, i) => <ModelCard key={m.model} m={m} i={i} />)}
      </div>
    </div>
  );
}
