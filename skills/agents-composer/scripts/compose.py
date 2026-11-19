#!/usr/bin/env python3
"""Assemble an AGENTS.md from the fragment catalog.

    compose.py list  --target codex --series 6.2
    compose.py build --target codex --series 6.2 -o AGENTS.md
    compose.py build --target dot --series 6.1 --off wording --grants grants.json

`build` starts from the fragments that are on by default for the series. `--scenes` narrows that
start to the named scenes, then `--on` and `--off` adjust single fragments. Standard library only.
"""
import argparse
import json
import re
import sys
from pathlib import Path

CATALOG = Path(__file__).resolve().parent.parent / "assets" / "catalog.json"
WHEN = re.compile(r"\{\{when ([\w:.-]+)\|([^|}]*)(?:\|([^|}]*))?\}\}")
GRANT_ORDER = 360
GRANT_FIELDS = (("scope", "Scope"), ("granted", "Granted"), ("why", "Why"), ("still_ask", "Still ask"), ("never", "Never"))


def is_chinese(language):
    return bool(re.search(r"chinese|中文|汉语|漢語", language, re.I))


def available(target, series, language):
    """The fragments that exist for this series and language, in document order."""
    zh = is_chinese(language)
    return [
        f for f in target["fragments"]
        if series in f["series"] and (f.get("locale") != "zh" or zh)
    ]


def defaults(fragments, series, scenes=None):
    """Ids a fresh configuration starts with. Fragments pulled in by `with` are never chosen directly."""
    return {
        f["id"] for f in fragments
        if series in f["default"] and not f.get("with") and (scenes is None or f["scene"] in scenes)
    }


def grant_fragment(grant, index, template):
    lines = [f"- {label}: {grant[key].strip()}" for key, label in GRANT_FIELDS if grant.get(key, "").strip()]
    return {
        "id": f"grant-custom-{index + 1}", "order": GRANT_ORDER + index, "kind": "grant",
        "group": template["group"], "section": template["section"],
        "body": f"### {grant['name'].strip()}\n\n" + "\n".join(lines),
    }


def resolve(fragments, chosen, grants=()):
    """Close the chosen ids over `requires` and `with`; return the fragments to emit, in order."""
    by_id = {f["id"]: f for f in fragments}
    intro = next((f for f in fragments if f["id"] == "grants-intro"), None)
    extra = [grant_fragment(g, i, intro) for i, g in enumerate(grants)] if intro else []
    picked = {i for i in chosen if i in by_id and not by_id[i].get("with")} | {f["id"] for f in extra}
    pool = fragments + extra
    by_id.update({f["id"]: f for f in extra})
    while True:
        grown = set(picked)
        for i in picked:
            grown.update(r for r in by_id[i].get("requires", ()) if r in by_id)
        has_grant = any(by_id[i].get("kind") == "grant" for i in grown)
        for f in pool:
            if any(w in grown or (w == "kind:grant" and has_grant) for w in f.get("with", ())):
                grown.add(f["id"])
        if grown == picked:
            break
        picked = grown
    return sorted((f for f in pool if f["id"] in picked), key=lambda f: f["order"])


def fill(body, language, present):
    """Substitute {{language}} and {{when KEY|then|else}}; drop a line that a `when` emptied."""
    flags = set(present)
    if is_chinese(language):
        flags.add("zh")
    out = []
    for line in body.split("\n"):
        filled = WHEN.sub(lambda m: m.group(2) if m.group(1) in flags else (m.group(3) or ""), line)
        if filled or not WHEN.search(line):
            out.append(filled.replace("{{language}}", language))
    return "\n".join(out)


def blocks(selected, language):
    """[(fragment id or None for a heading, separator before the block, text)]."""
    present = [f["id"] for f in selected]
    out = []
    group = section = None
    prev_body = None
    for f in selected:
        heads = []
        if f.get("group") and f.get("group") != group:
            heads.append(f["group"])
        if f.get("section") and (f.get("group"), f.get("section")) != (group, section):
            heads.append(f["section"])
        if (f.get("group"), f.get("section")) != (group, section):
            prev_body = None
        group, section = f.get("group"), f.get("section")
        for h in heads:
            out.append((None, "\n\n" if out else "", h))
        body = fill(f["body"], language, present)
        tight = prev_body is not None and prev_body.rsplit("\n", 1)[-1].startswith("- ") and body.startswith("- ")
        out.append((f["id"], "" if not out else "\n" if tight else "\n\n", body))
        prev_body = body
    return out


def compose(target, series, language="Simplified Chinese", chosen=None, grants=()):
    fragments = available(target, series, language)
    if chosen is None:
        chosen = defaults(fragments, series)
    selected = resolve(fragments, chosen, grants)
    text = "".join(sep + body for _, sep, body in blocks(selected, language))
    return (text + "\n" if text else ""), selected


def load_catalog(path=CATALOG):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main():
    for stream in (sys.stdout, sys.stderr):
        getattr(stream, "reconfigure", lambda **_: None)(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=["list", "build"])
    ap.add_argument("--target", required=True, help="codex or dot")
    ap.add_argument("--series", required=True, help="6.2 or 6.1 (6.1 also covers GPT-6)")
    ap.add_argument("--lang", default="Simplified Chinese", help="conversation language, in English")
    ap.add_argument("--scenes", help="comma-separated scene ids to start from (default: all)")
    ap.add_argument("--on", default="", help="comma-separated fragment ids to add")
    ap.add_argument("--off", default="", help="comma-separated fragment ids to drop")
    ap.add_argument("--grants", help="JSON file: [{name, scope, granted, why, still_ask, never}] (Dot)")
    ap.add_argument("--json", action="store_true", help="list: machine-readable output")
    ap.add_argument("-o", "--output", help="build: write here instead of stdout")
    ap.add_argument("--catalog", default=str(CATALOG))
    a = ap.parse_args()

    catalog = load_catalog(a.catalog)
    if a.target not in catalog["targets"]:
        ap.error(f"unknown target {a.target!r}; choose from {', '.join(catalog['targets'])}")
    if a.series not in [s["id"] for s in catalog["series"]]:
        ap.error(f"unknown series {a.series!r}; choose from {', '.join(s['id'] for s in catalog['series'])}")
    target = catalog["targets"][a.target]
    fragments = available(target, a.series, a.lang)
    ids = {f["id"] for f in fragments}

    if a.command == "list":
        rows = [
            {k: f.get(k) for k in ("id", "scene", "title", "evidence", "note", "requires", "with", "kind")}
            | {"default": a.series in f["default"]}
            for f in fragments
        ]
        if a.json:
            print(json.dumps({"scenes": target["scenes"], "fragments": rows}, ensure_ascii=False, indent=1))
            return
        labels = {s["id"]: s["label"] for s in target["scenes"]}
        for scene in target["scenes"]:
            members = [r for r in rows if r["scene"] == scene["id"]]
            if not members:
                continue
            print(f"\n[{scene['id']}] {labels[scene['id']]}")
            for r in members:
                mark = "auto" if r["with"] else "on" if r["default"] else "off"
                print(f"  {mark:4} {r['id']:22} {catalog['evidence'][r['evidence']]}  {r['title']}")
                if r["note"]:
                    print(f"       {r['note']}")
        return

    scenes = set(a.scenes.split(",")) if a.scenes else None
    if scenes and (unknown := scenes - {s["id"] for s in target["scenes"]}):
        ap.error(f"unknown scenes: {', '.join(sorted(unknown))}")
    on, off = ({x for x in s.split(",") if x} for s in (a.on, a.off))
    if unknown := (on | off) - ids:
        ap.error(f"not available for {a.target} {a.series} in {a.lang}: {', '.join(sorted(unknown))}")
    grants = json.loads(Path(a.grants).read_text(encoding="utf-8")) if a.grants else []
    chosen = (defaults(fragments, a.series, scenes) | on) - off
    text, selected = compose(target, a.series, a.lang, chosen, grants)
    if a.output:
        Path(a.output).write_text(text, encoding="utf-8", newline="\n")
    else:
        sys.stdout.write(text)
    print(f"{len(text.encode('utf-8'))} bytes: {', '.join(f['id'] for f in selected)}", file=sys.stderr)


if __name__ == "__main__":
    main()
