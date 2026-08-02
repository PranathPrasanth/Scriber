import argparse
import json
import time
from pathlib import Path

from src.extractors.gemini import GeminiExtractor
from src.extractors.gemma import GemmaExtractor
from src.extractors.nemotron import NemotronExtractor

from src.utils.file_utils import (
    ensure_directory,
    get_image_files,
    output_json_path,
)

IMAGE_DIR = Path("bills/images")
OUTPUT_ROOT = Path("outputs")

MAX_RETRIES = 3


def get_extractor(model_name: str):

    extractors = {
        "gemini": GeminiExtractor,
        "gemma": GemmaExtractor,
        "nemotron": NemotronExtractor,
    }

    if model_name not in extractors:
        raise ValueError(
            f"Unsupported model '{model_name}'. "
            f"Choose from: {', '.join(extractors.keys())}"
        )

    return extractors[model_name]()


def main():

    parser = argparse.ArgumentParser(
        description="Extract handwritten receipt information using an LLM."
    )

    parser.add_argument(
        "--model",
        required=True,
        choices=["gemini", "gemma", "nemotron"],
        help="LLM provider to use",
    )

    args = parser.parse_args()

    output_dir = OUTPUT_ROOT / args.model

    ensure_directory(output_dir)

    extractor = get_extractor(args.model)

    images = get_image_files(IMAGE_DIR)

    print(f"\nUsing: {args.model.upper()}")
    print(f"Found {len(images)} image(s).\n")

    for image in images:

        output_file = output_json_path(output_dir, image)

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

                transient_error = any(
                    keyword in error
                    for keyword in (
                        "429",
                        "RESOURCE_EXHAUSTED",
                        "getaddrinfo failed",
                        "Connection",
                        "Timeout",
                    )
                )

                if transient_error and attempt < MAX_RETRIES - 1:

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