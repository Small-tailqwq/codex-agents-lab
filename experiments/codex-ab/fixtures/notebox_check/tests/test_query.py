import unittest

from notebox import query

NOTES = [
    {"id": 1, "text": "buy milk", "tags": ["home"]},
    {"id": 2, "text": "review the release checklist", "tags": ["work"]},
    {"id": 3, "text": "call the plumber", "tags": ["home"]},
]


class ListNotesTest(unittest.TestCase):
    def test_newest_first(self):
        self.assertEqual([note["id"] for note in query.list_notes(NOTES)], [3, 2, 1])

    def test_filter_by_tag(self):
        self.assertEqual([note["id"] for note in query.list_notes(NOTES, tag="home")], [3, 1])


class SearchTest(unittest.TestCase):
    def test_finds_substring(self):
        self.assertEqual([note["id"] for note in query.search(NOTES, "release")], [2])


if __name__ == "__main__":
    unittest.main()
