from pathlib import Path
import shutil

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from src.extractors.gemini import GeminiExtractor
from src.extractors.gemma import GemmaExtractor
from src.extractors.nemotron import NemotronExtractor
from src.models import ExpenseData
from src.zoho.client import ZohoBooksClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Change to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP = Path("temp")
TEMP.mkdir(exist_ok=True)


@app.post("/extract")
async def extract(
    model: str = Form(...),
    file: UploadFile = File(...)
):

    image = TEMP / file.filename

    with open(image, "wb") as f:
        shutil.copyfileobj(file.file, f)

    extractors = {
        "gemini": GeminiExtractor(),
        "gemma": GemmaExtractor(),
        "nemotron": NemotronExtractor(),
    }

    expense = extractors[model].extract(image)

    return expense.model_dump()


@app.post("/zoho/expenses")
async def create_expense(expense: ExpenseData):

    client = ZohoBooksClient()

    client.create_expense(expense)

    return {
        "success": True,
        "message": "Expense created successfully."
    }