import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Check,
  Copy,
  Download,
  ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createZohoExpense, extractReceipt, type ExtractionResult, type ModelId } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Extract Receipts | Scriber" },
      {
        name: "description",
        content:
          "Drag and drop a receipt image, pick Gemini, Gemma or Nemotron, and extract structured expense data ready for Zoho Books.",
      },
      { property: "og:title", content: "Scriber Dashboard — Extract Receipts" },
      {
        property: "og:description",
        content: "Upload a receipt, run a vision model and create the expense in Zoho Books.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const MODELS: { id: ModelId; name: string; description: string; tag: string }[] = [
  { id: "gemini", name: "Gemini", description: "Fast and highly accurate extraction.", tag: "Best accuracy" },
  { id: "gemma", name: "Gemma", description: "Open-source Vision Language Model.", tag: "Open source" },
  { id: "nemotron", name: "Nemotron", description: "Efficient lightweight VLM.", tag: "Lightweight" },
];

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg"];

function Dashboard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>("gemini");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [zohoLoading, setZohoLoading] = useState(false);
  const [zohoDone, setZohoDone] = useState(false);

  const accept = useCallback((f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      setError("Unsupported file. Please upload a PNG, JPEG or JPG image.");
      return;
    }
    setError(null);
    setResult(null);
    setZohoDone(false);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const clear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setZohoDone(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onExtract = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setZohoDone(false);
    try {
      setResult(await extractReceipt(file, model));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed.");
    } finally {
      setLoading(false);
    }
  };

  const json = useMemo(() => (result ? JSON.stringify(result, null, 2) : ""), [result]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onDownload = () => {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result?.bill_number ?? "receipt"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onZoho = async () => {
  if (!result) return;

  setZohoLoading(true);

  try {
    await createZohoExpense(result);
    setZohoDone(true);
    setError(null);
  } catch (e) {
    setError(
      e instanceof Error
        ? e.message
        : "Failed to create Zoho expense."
    );
  } finally {
    setZohoLoading(false);
  }
};

  const fields: [string, string][] = result
  ? [
      ["Vendor", result.vendor ?? "-"],
      ["Bill Number", result.bill_number ?? "-"],
      ["Date", result.date ?? "-"],
      [
        "Amount",
        result.amount != null
          ? result.amount.toLocaleString("en-IN")
          : "-"
      ],
      ["Currency", result.currency ?? "INR"],
      ["GST", result.gst ?? "-"],
    ]
  : [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Receipt Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a receipt, choose a vision model and extract structured expense data.
        </p>
      </header>

      {/* Upload */}
      <section className="glass-card mt-10 p-6 sm:p-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) accept(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
            dragging
              ? "border-primary bg-accent/60"
              : "border-primary/20 bg-background/50 hover:border-primary/40 hover:bg-accent/30"
          }`}
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground">
            <UploadCloud className="h-6 w-6" />
          </span>
          <p className="mt-4 text-base font-medium">Drag and drop your receipt here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse — supported: PNG, JPEG, JPG
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) accept(f);
            }}
          />
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid gap-4 rounded-2xl border border-primary/10 bg-background/60 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
          >
            <img
              src={preview}
              alt="Uploaded receipt preview"
              className="h-32 w-32 rounded-xl object-cover shadow-sm"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate text-sm font-medium">
                <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
                {file?.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {file ? `${(file.size / 1024).toFixed(0)} KB` : ""}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clear} className="justify-self-start">
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          </motion.div>
        )}
      </section>

      {/* Model selection */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Select a model</h2>
        <p className="mt-1 text-sm text-muted-foreground">Only one model runs per extraction.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {MODELS.map((m) => {
            const active = model === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setModel(m.id)}
                className={`glass-card hover-lift p-5 text-left transition-all ${
                  active ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      active
                        ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground"
                        : "border-primary/25"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{m.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                <span className="mt-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  {m.tag}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Extract */}
      <div className="mt-10">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={!file || loading}
          onClick={onExtract}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Extracting…
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" /> Extract Receipt
            </>
          )}
        </Button>
      </div>

      {/* Result */}
      {loading && (
        <section className="glass-card mt-10 space-y-4 p-6 sm:p-8">
          <Skeleton className="h-6 w-48" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </section>
      )}

      {result && !loading && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card mt-10 p-6 sm:p-8"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold tracking-tight">Extraction Result</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Extracted with {MODELS.find((m) => m.id === model)?.name}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="glass" size="sm" onClick={onCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="glass" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4" /> JSON
              </Button>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-primary/10 bg-background/60 p-4"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1.5 truncate text-lg font-semibold tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.section>
      )}

      {/* Zoho */}
      {result && !loading && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card mt-6 grid gap-5 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-8"
        >
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">Zoho Books</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Push this extraction straight into your books as an expense.
            </p>
            {zohoDone && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
                <BadgeCheck className="h-4 w-4" /> Expense successfully created.
              </p>
            )}
          </div>
          <Button variant="hero" size="lg" onClick={onZoho} disabled={zohoLoading}>
            {zohoLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating…
              </>
            ) : (
              "Create Expense in Zoho Books"
            )}
          </Button>
        </motion.section>
      )}
    </div>
  );
}
