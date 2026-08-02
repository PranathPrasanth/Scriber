import base64
import json
from pathlib import Path

from openai import OpenAI

from src.config import OPENAI_API_KEY
from src.extractors.base import BaseExtractor
from src.models import ExpenseData
from src.prompts.receipt_extraction import RECEIPT_EXTRACTION_PROMPT


class OpenAIExtractor(BaseExtractor):

    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_API_KEY)

    def extract(self, image_path: Path) -> ExpenseData:

        suffix = image_path.suffix.lower()

        mime_type = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
        }.get(suffix)

        if mime_type is None:
            raise ValueError(f"Unsupported image format: {suffix}")

        image_data = base64.b64encode(
            image_path.read_bytes()
        ).decode("utf-8")

        response = self.client.responses.create(
            model="gpt-4.1-mini",

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

        data.setdefault("vendor", None)
        data.setdefault("bill_number", None)
        data.setdefault("date", None)
        data.setdefault("amount", None)
        data.setdefault("currency", "INR")
        data.setdefault("gst", None)

        return ExpenseData.model_validate(data)