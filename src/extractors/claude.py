import base64
import json
from pathlib import Path

import anthropic

from src.config import ANTHROPIC_API_KEY
from src.extractors.base import BaseExtractor
from src.models import ExpenseData
from src.prompts.receipt_extraction import RECEIPT_EXTRACTION_PROMPT


class ClaudeExtractor(BaseExtractor):

    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=ANTHROPIC_API_KEY
        )

    def extract(self, image_path: Path) -> ExpenseData:

        suffix = image_path.suffix.lower()

        media_type = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
        }.get(suffix)

        if media_type is None:
            raise ValueError(f"Unsupported image format: {suffix}")

        image_data = base64.b64encode(
            image_path.read_bytes()
        ).decode("utf-8")

        response = self.client.messages.create(
            model="claude-3-5-sonnet-latest",

            max_tokens=512,

            temperature=0,

            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": RECEIPT_EXTRACTION_PROMPT,
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_data,
                            },
                        },
                    ],
                }
            ],
        )

        data = json.loads(response.content[0].text)

        data.setdefault("vendor", None)
        data.setdefault("bill_number", None)
        data.setdefault("date", None)
        data.setdefault("amount", None)
        data.setdefault("currency", "INR")
        data.setdefault("gst", None)

        return ExpenseData.model_validate(data)