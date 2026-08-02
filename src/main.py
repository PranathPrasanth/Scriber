import json
import time
from pathlib import Path

from src.extractors.gemini import GeminiExtractor
from src.utils.file_utils import (
    get_image_files,
    ensure_directory,
    output_json_path,
)

IMAGE_DIR = Path("bills/images")
OUTPUT_DIR = Path("outputs/gemini")

MAX_RETRIES = 3


def main():

    ensure_directory(OUTPUT_DIR)

    extractor = GeminiExtractor()

    images = get_image_files(IMAGE_DIR)

    print(f"Found {len(images)} image(s).\n")

    for image in images:

        output_file = output_json_path(OUTPUT_DIR, image)

        # Skip files already processed
        if output_file.exists():
            print(f"⏭ Skipping {image.name}")
            continue

        print(f"Processing {image.name}...")

        for attempt in range(MAX_RETRIES):

            try:

                expense = extractor.extract(image)

                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(
                        expense.model_dump(exclude_none=False),
                        f,
                        indent=4,
                        ensure_ascii=False,
                    )

                print("✓ Success")
                break

            except Exception as e:

                error = str(e)

                # Retry only for transient failures
                if (
                    "429" in error
                    or "RESOURCE_EXHAUSTED" in error
                    or "getaddrinfo failed" in error
                    or "Connection" in error
                    or "Timeout" in error
                ):

                    if attempt < MAX_RETRIES - 1:

                        wait = 5 * (attempt + 1)

                        print(
                            f"Temporary error. Retrying in {wait} seconds..."
                        )

                        time.sleep(wait)
                        continue

                print(f"✗ Failed: {image.name}")
                print(error)
                break

    print("\nFinished.")


if __name__ == "__main__":
    main()