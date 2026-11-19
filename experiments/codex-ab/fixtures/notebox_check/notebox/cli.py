import argparse

from . import query, store


def format_note(note):
    tags = " ".join("#" + tag for tag in note["tags"])
    return f'{note["id"]:>3}  {note["text"]}  {tags}'.rstrip()


def main(argv=None):
    parser = argparse.ArgumentParser(prog="notebox")
    commands = parser.add_subparsers(dest="command", required=True)

    add = commands.add_parser("add")
    add.add_argument("text")
    add.add_argument("--tag", action="append", default=[])

    listing = commands.add_parser("list")
    listing.add_argument("--limit", type=int)
    listing.add_argument("--tag")

    find = commands.add_parser("search")
    find.add_argument("keyword")

    args = parser.parse_args(argv)
    if args.command == "add":
        note = store.add(args.text, args.tag)
        print(format_note(note))
    elif args.command == "list":
        for note in query.list_notes(store.load(), args.limit, args.tag):
            print(format_note(note))
    elif args.command == "search":
        for note in query.search(store.load(), args.keyword):
            print(format_note(note))


if __name__ == "__main__":
    main()
