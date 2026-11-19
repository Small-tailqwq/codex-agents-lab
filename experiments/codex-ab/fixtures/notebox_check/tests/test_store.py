import os
import tempfile
import unittest

from notebox import store


class StoreTest(unittest.TestCase):
    def test_add_assigns_increasing_ids(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "notes.json")
            first = store.add("one", path=path)
            second = store.add("two", ["x"], path=path)
            self.assertEqual((first["id"], second["id"]), (1, 2))
            self.assertEqual(len(store.load(path)), 2)

    def test_missing_file_is_empty(self):
        self.assertEqual(store.load(os.path.join("does", "not", "exist.json")), [])


if __name__ == "__main__":
    unittest.main()
