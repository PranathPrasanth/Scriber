import json

from src.models import ExpenseData
from src.zoho.client import ZohoBooksClient

with open("outputs/gemini/auto_parts.json", encoding="utf-8") as f:
    expense = ExpenseData.model_validate(json.load(f))

ZohoBooksClient().create_expense(expense)