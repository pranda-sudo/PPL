from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import unicodedata
from dataclasses import dataclass
from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "ppl_source" / "ppl"
OUT_FILE = ROOT / "ppl_app" / "data" / "questions.json"
PDFTOPPM = Path("/Users/ja/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pdftoppm")


CATEGORY_LABELS = {
    "pravo": "Pravo",
    "komunikace": "Komunikace",
    "meterologie": "Meteorologie",
    "meteorologie": "Meteorologie",
    "lidska vykonost": "Lidska vykonnost",
    "letove zasady": "Letove zasady",
    "provozni postupy": "Provozni postupy",
    "provedeni naplanovani letu": "Provedeni a planovani letu",
    "obecna znalost o letadle": "Obecna znalost o letadle",
    "navigace letoun": "Navigace",
}


@dataclass
class Line:
    y: float
    min_x: float
    text: str


def ascii_key(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    stripped = "".join(ch for ch in normalized if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", stripped.lower()).strip()


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    value = value.replace(" - ", "-")
    value = value.replace(" ,", ",").replace(" .", ".").replace(" ?", "?")
    value = value.replace(" :", ":").replace("( ", "(").replace(" )", ")")
    return value


def pdfs() -> list[Path]:
    return sorted(
        p
        for p in SOURCE_DIR.rglob("*.pdf")
        if "__MACOSX" not in p.parts and not p.name.startswith("._")
    )


def category_for(path: Path) -> str:
    key = ascii_key(path.parent.name)
    return CATEGORY_LABELS.get(key, path.parent.name)


def aircraft_for(path: Path) -> str:
    key = ascii_key(path.name)
    if "vrtulnik" in key:
        return "Vrtulnik"
    if "letoun" in key:
        return "Letoun"
    return "Spolecne"


def page_lines(page) -> list[Line]:
    chunks: list[tuple[float, float, str]] = []

    def visitor(text, _cm, tm, _font, _size):
        text = text.strip()
        if text:
            chunks.append((float(tm[4]), float(tm[5]), text))

    page.extract_text(visitor_text=visitor)

    rows: list[list[tuple[float, float, str]]] = []
    for x, y, text in sorted(chunks, key=lambda item: (-item[1], item[0])):
        if rows and abs(rows[-1][0][1] - y) < 1.3:
            rows[-1].append((x, y, text))
        else:
            rows.append([(x, y, text)])

    lines: list[Line] = []
    for row in rows:
        row.sort(key=lambda item: item[0])
        text = clean_text(" ".join(item[2] for item in row))
        if not text or text.startswith("Verze ") or text == "Verze":
            continue
        lines.append(Line(y=sum(item[1] for item in row) / len(row), min_x=min(item[0] for item in row), text=text))
    return lines


def render_pdf_pages(pdf_path: Path) -> list[Path]:
    tmpdir = Path(tempfile.mkdtemp(prefix="ppl-page-", dir="/private/tmp"))
    prefix = tmpdir / "page"
    env = os.environ.copy()
    env["XDG_CACHE_HOME"] = "/private/tmp"
    env["FONTCONFIG_PATH"] = "/private/tmp"
    subprocess.run(
        [
            str(PDFTOPPM),
            "-png",
            "-r",
            "72",
            str(pdf_path),
            str(prefix),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        env=env,
    )
    return sorted(tmpdir.glob("page-*.png"))


def checkbox_score(
    image: Image.Image,
    page_width: float,
    page_height: float,
    line: Line,
) -> tuple[int, int]:
    scale = image.width / page_width
    box_left = max(8, line.min_x - 23)
    x1, x2 = int(box_left * scale), int((box_left + 14) * scale)
    y_pdf = line.y
    y1 = int((page_height - (y_pdf + 8)) * scale)
    y2 = int((page_height - (y_pdf - 4)) * scale)
    crop = image.crop((x1, y1, x2, y2)).convert("L")
    if crop.width < 10 or crop.height < 10:
        return (0, 0)
    inner = crop.crop((3, 3, crop.width - 3, crop.height - 3))
    all_dark = sum(pixel < 120 for pixel in crop.getdata())
    inner_dark = sum(pixel < 120 for pixel in inner.getdata())
    return all_dark, inner_dark


def has_checkbox(image: Image.Image, page_width: float, page_height: float, line: Line) -> bool:
    all_dark, _inner_dark = checkbox_score(image, page_width, page_height, line)
    return all_dark >= 20 and 64 <= line.min_x <= 108


def is_checked(image: Image.Image, page_width: float, page_height: float, line: Line) -> bool:
    _all_dark, inner_dark = checkbox_score(image, page_width, page_height, line)
    return inner_dark >= 16


def checked_score(image: Image.Image, page_width: float, page_height: float, line: Line) -> int:
    all_dark, inner_dark = checkbox_score(image, page_width, page_height, line)
    return all_dark + inner_dark


def question_starts(lines: list[Line]) -> list[int]:
    starts: list[int] = []
    for index, line in enumerate(lines):
        if 42 <= line.min_x <= 78 and re.match(r"^\d+\b", line.text):
            starts.append(index)
    return starts


def strip_question_number(text: str) -> tuple[str, str]:
    match = re.match(r"^(\d+)\s+(.*)$", text)
    if match:
        return match.group(1), match.group(2).strip()
    return text.strip(), ""


def parse_block(
    block: list[Line],
    image: Image.Image,
    page_width: float,
    page_height: float,
) -> dict | None:
    if not block:
        return None

    number, first_text = strip_question_number(block[0].text)
    option_starts = [
        index
        for index, line in enumerate(block)
        if has_checkbox(image, page_width, page_height, line)
    ]
    if len(option_starts) < 2:
        return None

    question_lines = []
    if first_text:
        question_lines.append(first_text)
    question_lines.extend(line.text for line in block[1 : option_starts[0]])

    options = []
    scores = []
    for option_index, start in enumerate(option_starts):
        end = option_starts[option_index + 1] if option_index + 1 < len(option_starts) else len(block)
        option_text = clean_text(" ".join(line.text for line in block[start:end]))
        if option_text:
            options.append(option_text)
            scores.append(checked_score(image, page_width, page_height, block[start]))

    question = clean_text(" ".join(question_lines))
    if not question or len(options) < 2:
        return None
    correct_index = max(range(len(scores)), key=lambda index: scores[index])

    return {
        "sourceNumber": number,
        "question": question,
        "options": options,
        "correctIndex": correct_index,
    }


def extract_pdf(pdf_path: Path) -> list[dict]:
    reader = PdfReader(str(pdf_path))
    questions: list[dict] = []
    images = render_pdf_pages(pdf_path)
    for page_index, page in enumerate(reader.pages):
        lines = page_lines(page)
        starts = question_starts(lines)
        if not starts:
            continue

        page_width = float(page.mediabox.width)
        page_height = float(page.mediabox.height)
        image_path = images[page_index]
        image = Image.open(image_path)

        for pos, start in enumerate(starts):
            end = starts[pos + 1] if pos + 1 < len(starts) else len(lines)
            parsed = parse_block(lines[start:end], image, page_width, page_height)
            if parsed:
                parsed["category"] = category_for(pdf_path)
                parsed["aircraft"] = aircraft_for(pdf_path)
                parsed["sourceFile"] = pdf_path.name
                parsed["page"] = page_index + 1
                parsed["id"] = f"{ascii_key(pdf_path.stem).replace(' ', '-')}-{parsed['sourceNumber']}"
                questions.append(parsed)
    return questions


def main() -> None:
    all_questions: list[dict] = []
    per_file: dict[str, int] = {}
    for pdf_path in pdfs():
        extracted = extract_pdf(pdf_path)
        all_questions.extend(extracted)
        per_file[str(pdf_path.relative_to(SOURCE_DIR))] = len(extracted)

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(
        json.dumps(
            {
                "generatedFrom": "ppl.zip",
                "total": len(all_questions),
                "files": per_file,
                "questions": all_questions,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {len(all_questions)} questions to {OUT_FILE}")
    for name, count in per_file.items():
        print(f"{count:4d}  {name}")


if __name__ == "__main__":
    main()
