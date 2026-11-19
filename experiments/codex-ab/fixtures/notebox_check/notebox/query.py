def list_notes(notes, limit=None, tag=None):
    """Return notes newest first, optionally filtered by tag and capped at `limit`."""
    selected = [note for note in notes if tag is None or tag in note["tags"]]
    selected.sort(key=lambda note: note["id"], reverse=True)
    if limit is not None:
        selected = selected[: limit + 1]
    return selected


def search(notes, keyword):
    """Return notes whose text contains `keyword`, ignoring case."""
    keyword = keyword.lower()
    return [note for note in notes if keyword in note["text"]]
