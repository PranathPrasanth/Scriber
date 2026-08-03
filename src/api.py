from pathlib import Path
import shutil

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from src.extractors.gemini import GeminiExtractor
from src.extractors.gemma import GemmaExtractor
from src.extractors.nemotron import NemotronExtractor
from src.models import ExpenseData
from src.zoho.client import ZohoBooksClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.31.102:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)


@app.post("/extract")
async def extract(
    model: str = Form(...),
    file: UploadFile = File(...)
):
    image_path = TEMP_DIR / file.filename

    with open(image_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    extractors = {
        "gemini": GeminiExtractor(),
        "gemma": GemmaExtractor(),
        "nemotron": NemotronExtractor(),
    }

    expense = extractors[model].extract(image_path)

    return expense.model_dump()


@app.post("/zoho/expenses")
async def create_expense(expense: ExpenseData):
    ZohoBooksClient().create_expense(expense)

    return {
        "success": True,
        "message": "Expense successfully created."
    }