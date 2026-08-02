import { Link } from "@tanstack/react-router";
import { Github, Menu, ScanLine, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/evaluation", label: "Evaluation" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
            <ScanLine className="h-5 w-5" />
          </span>
          <span className="truncate text-lg font-semibold tracking-tight">Scriber</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary bg-accent/70" }}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/PranathPrasanth/Scriber"
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <Button asChild variant="hero" size="sm" className="ml-2 rounded-lg">
            <Link to="/dashboard">Upload Receipt</Link>
          </Button>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/15 md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <nav className="animate-fade-up border-t border-primary/10 px-5 pb-4 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
          >
            GitHub
          </a>
        </nav>
      )}
    </header>
  );
}
