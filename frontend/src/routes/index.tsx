import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BadgeCheck, FileJson, ScanLine, Sparkles, UploadCloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scriber — AI Receipt Extraction with Vision Language Models" },
      {
        name: "description",
        content:
          "Upload handwritten receipts, extract structured expense data with Gemini, Gemma or Nemotron, compare results and push expenses to Zoho Books.",
      },
      { property: "og:title", content: "Scriber — AI Receipt Extraction" },
      {
        property: "og:description",
        content:
          "Extract structured expense data from handwritten receipts using vision language models and sync to Zoho Books.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: ScanLine,
    title: "Handwritten-first OCR",
    body: "Vision language models read messy handwriting, faded thermal prints and mixed layouts.",
  },
  {
    icon: Zap,
    title: "Three models, one click",
    body: "Run Gemini, Gemma or Nemotron on the same receipt and compare structured output.",
  },
  {
    icon: FileJson,
    title: "Structured JSON",
    body: "Vendor, bill number, date, amount, currency and GST — copy or download instantly.",
  },
  {
    icon: BadgeCheck,
    title: "Zoho Books sync",
    body: "Turn a verified extraction into a booked expense without retyping a single field.",
  },
];

function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[image:var(--gradient-primary)] opacity-20 blur-[120px]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-4 py-1.5 text-xs font-medium text-secondary-foreground backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by Gemini · Gemma · Nemotron
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-7 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
          >
            AI Receipt Extraction using{" "}
            <span className="gradient-text">Vision Language Models</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Upload handwritten receipts, extract structured expense data using multiple AI models,
            compare results, and automatically create expenses in Zoho Books.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/dashboard">
                <UploadCloud className="h-5 w-5" /> Upload Receipt
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <a href="#learn-more">Learn More</a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="glass-card mx-auto mt-16 max-w-4xl p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["94.6%", "Best model accuracy"],
              ["240", "Bills evaluated"],
              ["6", "Fields extracted"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-primary/10 bg-background/60 p-5 text-center"
              >
                <p className="text-3xl font-semibold tracking-tight gradient-text">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="learn-more" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          From paper receipt to booked expense
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Scriber wraps a FastAPI vision pipeline in a workflow your finance team can actually use.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass-card hover-lift p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.article>
          ))}
        </div>

        <div className="glass-card mt-14 flex flex-col items-center gap-5 p-10 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">Ready to try it on a receipt?</h3>
          <p className="max-w-lg text-sm text-muted-foreground">
            No account needed. Drop in a PNG or JPEG and pick the model you want to run.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/dashboard">Upload Receipt</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
