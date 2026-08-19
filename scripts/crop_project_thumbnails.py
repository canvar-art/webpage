"""Center-crop project index thumbnails to an exact 16:9 ratio."""

from __future__ import annotations

import argparse
import os
import re
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PROJECTS_HTML = ROOT / "projects.html"
THUMBNAIL_PATTERN = re.compile(
    r'class="project-thumb"[^>]*>\s*<img\s+src="([^"]+)"', re.IGNORECASE
)


def largest_centered_16_9(width: int, height: int) -> tuple[int, int]:
    """Return the largest exact 16:9 size allowing symmetric cropping."""
    max_scale = min(width // 16, height // 9)
    for scale in range(max_scale, 0, -1):
        crop_width = 16 * scale
        crop_height = 9 * scale
        if (width - crop_width) % 2 == 0 and (height - crop_height) % 2 == 0:
            return crop_width, crop_height
    raise ValueError(f"Cannot create a centered 16:9 crop from {width}x{height}")


def project_thumbnails() -> list[Path]:
    html = PROJECTS_HTML.read_text(encoding="utf-8")
    return [ROOT / match for match in THUMBNAIL_PATTERN.findall(html)]


def crop_thumbnail(path: Path, dry_run: bool) -> None:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        width, height = image.size
        if width * 9 == height * 16:
            print(f"SKIP {path.name}: already 16:9 ({width}x{height})")
            return

        crop_width, crop_height = largest_centered_16_9(width, height)
        left = (width - crop_width) // 2
        top = (height - crop_height) // 2
        box = (left, top, left + crop_width, top + crop_height)
        print(
            f"CROP {path.name}: {width}x{height} -> {crop_width}x{crop_height} "
            f"(left/right {left}px, top/bottom {top}px)"
        )
        if dry_run:
            return

        cropped = image.crop(box)
        temporary = path.with_name(f".{path.stem}.cropping{path.suffix}")
        save_options: dict[str, object] = {}
        if source.info.get("icc_profile"):
            save_options["icc_profile"] = source.info["icc_profile"]
        if path.suffix.lower() in {".jpg", ".jpeg"}:
            save_options.update(quality=95, optimize=True)
        elif path.suffix.lower() == ".png":
            save_options["optimize"] = True

        try:
            cropped.save(temporary, **save_options)
            os.replace(temporary, path)
        finally:
            if temporary.exists():
                temporary.unlink()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Report crops without writing files")
    args = parser.parse_args()

    for thumbnail in project_thumbnails():
        crop_thumbnail(thumbnail, args.dry_run)


if __name__ == "__main__":
    main()
