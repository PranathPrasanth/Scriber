const stack = ["Python", "FastAPI", "Gemini", "Gemma", "Nemotron", "Zoho Books"];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-primary/10 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 text-center">
        <p className="text-sm text-muted-foreground">Built with</p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-primary/15 bg-card/70 px-4 py-1.5 text-sm font-medium text-secondary-foreground backdrop-blur-md"
            >
              {s}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Scriber — AI Receipt Extraction with Vision Language Models.
        </p>
      </div>
    </footer>
  );
}
