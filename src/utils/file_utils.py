from pathlib import Path

SUPPORTED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}


def get_image_files(image_dir: Path) -> list[Path]:
    """
    Returns all supported image files in sorted order.
    """

    if not image_dir.exists():
        raise FileNotFoundError(f"{image_dir} does not exist.")

    return sorted(
        file
        for file in image_dir.iterdir()
        if file.is_file() and file.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
    )


def ensure_directory(path: Path) -> None:
    """
    Creates a directory if it does not already exist.
    """

    path.mkdir(parents=True, exist_ok=True)


def output_json_path(output_dir: Path, image_path: Path) -> Path:
    """
    Returns the JSON output path corresponding to an image.
    """

    return output_dir / f"{image_path.stem}.json"