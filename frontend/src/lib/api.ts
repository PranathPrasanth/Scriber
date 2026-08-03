export type ModelId = "gemini" | "gemma" | "nemotron";

export interface ExtractionResult {
  vendor: string;
  bill_number: string;
  date: string;
  amount: number;
  currency: string;
  gst: number;
}

export interface ModelAccuracy {
  model: ModelId;
  name: string;
  overall_accuracy: number;
  bills_evaluated: number;
  success_rate: number;
}

const API_BASE =
  import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);

  if (!res.ok) {
    throw new Error(
      `Request failed [${res.status}]: ${await res.text()}`
    );
  }

  return (await res.json()) as T;
}

/** POST /extract */
export async function extractReceipt(
  file: File,
  model: ModelId
): Promise<ExtractionResult> {

  const form = new FormData();

  form.append("file", file);
  form.append("model", model);

  try {
    return await request<ExtractionResult>(
      "/extract",
      {
        method: "POST",
        body: form,
      }
    );
  } catch (err) {
    throw err;
  }
}

/** POST /zoho/expenses */
export async function createZohoExpense(
  data: ExtractionResult
): Promise<{ expense_id: string }> {

  try {
    return await request<{ expense_id: string }>(
      "/zoho/expenses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  } catch (err) {
    throw err;
  }
}

/** GET /evaluation */
export async function fetchEvaluation(): Promise<ModelAccuracy[]> {

  try {
    return await request<ModelAccuracy[]>("/evaluation");
  } catch (err) {
    throw err;
  }
}