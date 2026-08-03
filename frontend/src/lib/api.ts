export type ModelId = "gemini" | "gemma" | "nemotron";

export interface ExtractionResult {
  vendor: string | null;
  bill_number: string | null;
  date: string | null;
  amount: number | null;
  currency: string | null;
  gst: string | null;
}

export interface ModelAccuracy {
  model: ModelId;
  name: string;
  overall_accuracy: number;
  bills_evaluated: number;
  success_rate: number;
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);

  if (!res.ok) {
    throw new Error(
      `Request failed [${res.status}]: ${await res.text()}`
    );
  }

  return (await res.json()) as T;
}

export async function extractReceipt(
  file: File,
  model: ModelId
): Promise<ExtractionResult> {

  const form = new FormData();
  form.append("file", file);
  form.append("model", model);

  return request<ExtractionResult>("/extract", {
    method: "POST",
    body: form,
  });
}

export async function createZohoExpense(
  data: ExtractionResult
): Promise<{ success: boolean; expense_id: string; message: string }> {

  return request("/zoho/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function fetchEvaluation(): Promise<ModelAccuracy[]> {
  return request<ModelAccuracy[]>("/evaluation");
}