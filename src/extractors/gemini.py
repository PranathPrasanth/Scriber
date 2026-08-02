import json
from pathlib import Path

from google import genai
from google.genai import types

from src.config import GEMINI_API_KEY
from src.extractors.base import BaseExtractor
from src.models import ExpenseData
from src.prompts.receipt_extraction import RECEIPT_EXTRACTION_PROMPT


class GeminiExtractor(BaseExtractor):

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)

    def extract(self, image_path: Path) -> ExpenseData:

        suffix = image_path.suffix.lower()

        mime_type = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg"
        }.get(suffix)

        if mime_type is None:
            raise ValueError(f"Unsupported image format: {suffix}")

        response = self.client.models.generate_content(
            model="gemini-flash-latest",

            contents=[
                RECEIPT_EXTRACTION_PROMPT,
                types.Part.from_bytes(
                    data=image_path.read_bytes(),
                    mime_type=mime_type,
                ),
            ],

            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0,
            ),
        )

        data = json.loads(response.text)

        return ExpenseData.model_validate(data)