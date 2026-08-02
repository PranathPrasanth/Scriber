import { createFileRoute, Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Scriber — How the Receipt Pipeline Works" },
      {
        name: "description",
        content:
          "Scriber pairs a FastAPI vision pipeline with Gemini, Gemma and Nemotron to turn handwritten receipts into Zoho Books expenses.",
      },
      { property: "og:title", content: "About Scriber" },
      {
        property: "og:description",
        content: "How Scriber extracts structured expense data from handwritten receipts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const steps = [
  {
    title: "1 · Upload",
    body: "A PNG or JPEG receipt is posted to the FastAPI backend as multipart form data.",
  },
  {
    title: "2 · Extract",
    body: "The selected vision language model reads the image and returns a strict JSON schema: vendor, bill number, date, amount, currency and GST.",
  },
  {
    title: "3 · Compare",
    body: "Every run is scored against a labelled benchmark set so you can see which model to trust per receipt type.",
  },
  {
    title: "4 · Book",
    body: "One click creates the matching expense in Zoho Books through the accounting integration.",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Scriber</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Scriber is an AI receipt extraction workspace for finance teams that still receive
        handwritten and printed paper bills. It runs multiple vision language models over the same
        image, compares their structured output, and pushes the verified result into Zoho Books.
      </p>

      <div className="mt-10 space-y-4">
        {steps.map((s) => (
          <section key={s.title} className="glass-card hover-lift p-6">
            <h2 className="text-base font-semibold tracking-tight gradient-text">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="hero" size="lg">
          <Link to="/dashboard">Try the dashboard</Link>
        </Button>
        <Button asChild variant="glass" size="lg">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github className="h-4 w-4" /> View on GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
