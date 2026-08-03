import shutil
from pathlib import Path

from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware

from src.extractors.gemini import GeminiExtractor
from src.extractors.gemma import GemmaExtractor
from src.extractors.nemotron import NemotronExtractor
from src.models import ExpenseData
from src.zoho.client import ZohoBooksClient

app = FastAPI(title="Scriber API")

# ------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.31.222:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)

EXTRACTORS = {
    "gemini": GeminiExtractor,
    "gemma": GemmaExtractor,
    "nemotron": NemotronExtractor,
}


# ------------------------------------------------------------------
# Extract Receipt
# ------------------------------------------------------------------

@app.post("/extract")
async def extract(
    model: str = Form(...),
    file: UploadFile = File(...),
):

    if model not in EXTRACTORS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported model: {model}",
        )

    image_path = TEMP_DIR / file.filename

    try:

        with open(image_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        extractor = EXTRACTORS[model]()

        expense = extractor.extract(image_path)

        return expense.model_dump()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:

        if image_path.exists():
            image_path.unlink()


# ------------------------------------------------------------------
# Zoho Books
# ------------------------------------------------------------------

@app.post("/zoho/expenses")
async def create_expense(expense: ExpenseData):

    try:

        client = ZohoBooksClient()

        client.create_expense(expense)

        return {
            "success": True,
            "expense_id": expense.bill_number,
            "message": "Expense successfully created.",
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ------------------------------------------------------------------
# Evaluation
# ------------------------------------------------------------------

@app.get("/evaluation")
async def get_evaluation():

    report = Path("reports/evaluation.txt")

    if not report.exists():
        return []

    text = report.read_text(encoding="utf-8")

    models = []
    current = None

    for line in text.splitlines():

        line = line.strip()

        if line in ("Gemini", "Gemma", "Nemotron"):

            current = {
                "model": line.lower(),
                "name": line,
            }

        elif line.startswith("Overall Accuracy"):

            current["overall_accuracy"] = float(
                line.split(":")[1]
                .replace("%", "")
                .strip()
            )

        elif line.startswith("Bills Evaluated"):

            current["bills_evaluated"] = int(
                line.split(":")[1]
                .split("/")[0]
                .strip()
            )

        elif line.startswith("Success Rate"):

            current["success_rate"] = float(
                line.split(":")[1]
                .replace("%", "")
                .strip()
            )

            models.append(current)

    return models


# ------------------------------------------------------------------
# Health Check
# ------------------------------------------------------------------

@app.get("/")
def health():

    return {
        "status": "ok",
        "service": "Scriber API",
    }