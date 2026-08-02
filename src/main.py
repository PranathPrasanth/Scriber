import json
from pathlib import Path

from src.extractors.gemini import GeminiExtractor
from src.utils.file_utils import (
    get_image_files,
    ensure_directory,
    output_json_path,
)
import time

IMAGE_DIR = Path("bills/images")
OUTPUT_DIR = Path("outputs/gemini")


def main():

    ensure_directory(OUTPUT_DIR)

    extractor = GeminiExtractor()

    images = get_image_files(IMAGE_DIR)

    print(f"Found {len(images)} image(s).\n")

    for image in images:

        print(f"Processing {image.name}...")

        try:

            expense = extractor.extract(image)

            output_file = output_json_path(OUTPUT_DIR, image)

            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(
                    expense.model_dump(exclude_none=False),
                    f,
                    indent=4,
                    ensure_ascii=False
                )

            print("✓ Success")

            time.sleep(15)

        except Exception as e:

            print(f"✗ Failed : {image.name}")
            print(e)

    print("\nFinished.")
    

if __name__ == "__main__":
    main()