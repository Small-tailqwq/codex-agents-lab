import os, tempfile
import re, sys, html
from html.parser import HTMLParser
from pathlib import Path
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.skip = 0; s.out = []; s.stack = []
    def handle_starttag(s, tag, attrs):
        if tag in ('style', 'script', 'title', 'svg'): s.skip += 1
        s.stack.append(tag)
    def handle_endtag(s, tag):
        if tag in ('style', 'script', 'title', 'svg'): s.skip -= 1
    def handle_data(s, d):
        d = ' '.join(d.split())
        if d and not s.skip: s.out.append((s.stack[-1] if s.stack else '?', d))
LAB = Path(os.environ.get("CODEX_AB_WORK") or Path(tempfile.gettempdir()) / "codex-ab")
for run in sorted((LAB / 'runs').glob((sys.argv[1] if len(sys.argv) > 1 else 'S5') + '*')):
    f = run / 'repo' / 'index.html'
    if not f.exists(): print(run.name, 'NO index.html'); continue
    src = f.read_text(encoding='utf-8', errors='replace')
    p = P(); p.feed(src)
    texts = [t for _, t in p.out]
    allt = ' '.join(texts)
    latin = [t for t in texts if re.fullmatch(r"[A-Za-z0-9 .,&'·/:\-–—]+", t) and re.search('[A-Za-z]{3}', t)]
    nums = [t for t in texts if re.fullmatch(r'0\d|[一二三四五六七八九十]|No\.? ?\d+|\d{2} ?/ ?\d{2}', t)]
    pseudo = len(re.findall(r'content:\s*["\'][^"\']{2,}', src))
    print(f"## {run.name}: nodes={len(texts)} chars={len(allt)} latin_only={len(latin)} numbering={len(nums)} css_content={pseudo} bytes={len(src)}")
    if '--text' in sys.argv:
        print('   ' + ' | '.join(f'<{tag}>{t}' for tag, t in p.out)[:2600])
