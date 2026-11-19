#!/usr/bin/env python3
"""Build everything derived from fragments/: the catalog (for the skill and the site) and presets/.

    python tools/build.py          write the generated files
    python tools/build.py --check  fail if a generated file is stale, a preset no longer reproduces
                                   the AGENTS.md it was cut from, or docs/compose.js disagrees with compose.py
"""
import json
import random
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "skills/agents-composer/scripts"))
import compose as C  # noqa: E402

LIST_KEYS = ("series", "default", "with", "requires")
AUTHOR_GRANTS = {"grant-games", "grant-cor3", "grant-github-bot"}
# (target, series, extra fragment ids, the file the defaults must reproduce byte for byte)
SNAPSHOTS = [
    ("codex", "6.2", set(), "research/codex/history/AGENTS.6.2-2026-11-18.md"),
    ("codex", "6.1", set(), "research/codex/history/AGENTS.live-2026-11-14.md"),
    ("dot", "6.1", AUTHOR_GRANTS, "research/dot/AGENTS.author-2026-11-18.md"),
]


def read(path):
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def parse(path):
    text = read(path)
    _, head, body = text.split("---\n", 2)
    f: dict = {"order": int(path.name[:3])}
    for line in head.strip().split("\n"):
        key, value = line.split(": ", 1)
        f[key] = [v.strip() for v in value.split(",")] if key in LIST_KEYS else value
    body, _, zh = body.partition("\n<!-- zh -->\n")
    f["body"], f["zh"] = body.strip("\n"), zh.strip("\n")
    if f["default"] == ["on"]:
        f["default"] = list(f["series"])
    elif f["default"] == ["off"]:
        f["default"] = []
    return f


def build_catalog():
    catalog = json.loads(read(ROOT / "fragments/_catalog.json"))
    series = {s["id"] for s in catalog["series"]}
    catalog["targets"] = {}
    for tdir in sorted(p for p in (ROOT / "fragments").iterdir() if p.is_dir()):
        target = json.loads(read(tdir / "_target.json"))
        target["fragments"] = [parse(p) for p in sorted(tdir.glob("[0-9]*.md"))]
        catalog["targets"][tdir.name] = target
        scenes = {s["id"] for s in target["scenes"]}
        ids = {f["id"] for f in target["fragments"]}
        seen = set()
        for f in target["fragments"]:
            where = f"{tdir.name}/{f['id']}"
            assert set(f["series"]) <= series and set(f["default"]) <= set(f["series"]), where
            assert f["scene"] in scenes and f["evidence"] in catalog["evidence"], where
            for s in f["series"]:
                assert (f["id"], s) not in seen, f"{where}: two variants for {s}"
                seen.add((f["id"], s))
            refs = set(f.get("requires", [])) | set(f.get("with", [])) | {m.group(1) for m in C.WHEN.finditer(f["body"])}
            assert refs <= ids | {"zh", "kind:grant"}, f"{where}: unknown reference {refs - ids}"
            for text in (f["body"], f["zh"]):
                assert "{{" not in C.WHEN.sub("", text).replace("{{language}}", ""), f"{where}: malformed placeholder"
            en, zh = f["body"].split("\n"), f["zh"].split("\n")
            assert [bool(x) for x in en] == [bool(x) for x in zh], f"{where}: zh must mirror the body line for line"
            keys = lambda lines: [[m[0] for m in C.WHEN.findall(x)] for x in lines]  # noqa: E731
            assert keys(en) == keys(zh), f"{where}: zh must use the same when-keys as the body"
            for h in (f.get("group"), f.get("section")):
                assert h is None or h in target["headings"], f"{where}: no translation for heading {h}"
    return catalog


def outputs(catalog):
    data = json.dumps(catalog, ensure_ascii=False, indent=1) + "\n"
    files = {
        "skills/agents-composer/assets/catalog.json": data,
        "docs/catalog.js": "globalThis.AGENTS_CATALOG = " + data.rstrip("\n") + ";\n",
    }
    for name, target in catalog["targets"].items():
        for s in catalog["series"]:
            files[f"presets/{name}-{s['id']}/AGENTS.md"] = C.compose(target, s["id"])[0]
    return files


def check_snapshots(catalog):
    bad = []
    for name, series, extra, path in SNAPSHOTS:
        target = catalog["targets"][name]
        chosen = C.defaults(C.available(target, series, "Simplified Chinese"), series) | extra
        if C.compose(target, series, chosen=chosen)[0] != read(ROOT / path):
            bad.append(f"{name} {series} no longer reproduces {path}")
    return bad


def check_js(catalog):
    """Random selections must come out identical from compose.py and docs/compose.js."""
    node = shutil.which("node")
    if not node:
        return ["node not found: docs/compose.js was not compared against compose.py"]
    rng = random.Random(62)
    cases = []
    for name, target in catalog["targets"].items():
        for s in catalog["series"]:
            for lang in ("Simplified Chinese", "English", "繁體中文"):
                ids = [f["id"] for f in C.available(target, s["id"], lang)]
                for _ in range(40):
                    chosen = [i for i in ids if rng.random() < rng.choice((0.2, 0.6, 0.95))]
                    grants = [
                        {"name": f"Grant {n}", "scope": "a scope", "granted": "an action",
                         "why": "a reason", "still_ask": "x" * rng.randint(0, 1), "never": " " * rng.randint(0, 2)}
                        for n in range(rng.choice((0, 0, 1, 2)) if name == "dot" else 0)
                    ]
                    text, selected = C.compose(target, s["id"], lang, chosen, grants)
                    cases.append({"target": name, "series": s["id"], "lang": lang, "chosen": chosen, "grants": grants,
                                  "text": text, "ids": [f["id"] for f in selected]})
                cases.append({"target": name, "series": s["id"], "lang": lang, "chosen": None, "grants": [],
                              "text": C.compose(target, s["id"], lang)[0],
                              "ids": [f["id"] for f in C.compose(target, s["id"], lang)[1]]})
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "cases.json"
        path.write_text(json.dumps(cases, ensure_ascii=False), encoding="utf-8")
        p = subprocess.run([node, str(ROOT / "tools/parity.mjs"), str(path)], capture_output=True, text=True, encoding="utf-8")
    return [] if p.returncode == 0 else [(p.stdout + p.stderr).strip() or "tools/parity.mjs failed"]


def main():
    check = "--check" in sys.argv[1:]
    catalog = build_catalog()
    files = outputs(catalog)
    problems = []
    for rel, text in files.items():
        path = ROOT / rel
        if check:
            if not path.exists() or read(path) != text:
                problems.append(f"{rel} is stale: run python tools/build.py")
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8", newline="\n")
    problems += check_snapshots(catalog)
    if check:
        problems += check_js(catalog)
    for name in catalog["targets"]:
        for s in catalog["series"]:
            size = len(files[f"presets/{name}-{s['id']}/AGENTS.md"].encode("utf-8"))
            print(f"presets/{name}-{s['id']}/AGENTS.md  {size} bytes")
    for p in problems:
        print("FAIL", p, file=sys.stderr)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
