# notebox

A tiny command-line note keeper. Notes live in a JSON file.

## Usage

```
python -m notebox.cli add "buy milk" --tag home
python -m notebox.cli list --limit 5
python -m notebox.cli list --tag home
python -m notebox.cli search milk
```

Set `NOTEBOX_FILE` to change where notes are stored (default: `data/notes.json`).

## Development

Run the tests with `make test`. Run `make check` before sending a change.
