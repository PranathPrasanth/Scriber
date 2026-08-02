import base64
import json
from pathlib import Path

from openai import OpenAI

from src.config import OPENROUTER_API_KEY
from src.extractors.base import BaseExtractor
from src.models import ExpenseData
from src.prompts.receipt_extraction import RECEIPT_EXTRACTION_PROMPT


class GemmaExtractor(BaseExtractor):

    def __init__(self):
        self.client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
        )

    def extract(self, image_path: Path) -> ExpenseData:

        suffix = image_path.suffix.lower()

        mime_type = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
        }.get(suffix)

        if mime_type is None:
            raise ValueError(
                f"Unsupported image format: {suffix}"
            )

        image_data = base64.b64encode(
            image_path.read_bytes()
        ).decode()

        response = self.client.responses.create(
            model="google/gemma-4-26b-a4b-it:free",

            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": RECEIPT_EXTRACTION_PROMPT,
                        },
                        {
                            "type": "input_image",
                            "image_url": f"data:{mime_type};base64,{image_data}",
                        },
                    ],
                }
            ],
        )

        data = json.loads(response.output_text)

        return ExpenseData.model_validate(data)