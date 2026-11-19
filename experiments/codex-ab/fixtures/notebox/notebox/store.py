import json
import os

DEFAULT_PATH = os.path.join("data", "notes.json")


def notes_path():
    return os.environ.get("NOTEBOX_FILE", DEFAULT_PATH)


def load(path=None):
    path = path or notes_path()
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save(notes, path=None):
    path = path or notes_path()
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(notes, f, ensure_ascii=False, indent=2)


def add(text, tags=(), path=None):
    notes = load(path)
    next_id = max((note["id"] for note in notes), default=0) + 1
    note = {"id": next_id, "text": text, "tags": list(tags)}
    notes.append(note)
    save(notes, path)
    return note
