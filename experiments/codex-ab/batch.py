"""python batch.py <arms> <scenarios> <models> <reps> [effort] [workers]  e.g. L,N S1,S2 sol,astra 1,2"""
import os, tempfile
import subprocess, sys, itertools
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

LAB = Path(os.environ.get("CODEX_AB_WORK") or Path(tempfile.gettempdir()) / "codex-ab")
arms, scens, models, reps = (a.split(',') for a in sys.argv[1:5])
effort = sys.argv[5] if len(sys.argv) > 5 else 'xhigh'
workers = int(sys.argv[6]) if len(sys.argv) > 6 else 4

def one(spec):
    rep, scen, model, arm = spec
    m = 'gpt-6.2-' + model
    rid = f"{scen}-{arm}-{m.replace('gpt-','')}-{effort}-{rep}"
    if (LAB / 'runs' / rid / 'meta.json').exists():
        return rid + ' (cached)'
    p = subprocess.run([sys.executable, str(Path(__file__).parent / 'run.py'), scen, arm, m, effort, rep], capture_output=True, text=True, encoding='utf-8', errors='replace')
    return (p.stdout.strip() or p.stderr.strip()[-300:])

with ThreadPoolExecutor(workers) as ex:
    for line in ex.map(one, itertools.product(reps, scens, models, arms)):
        print(line, flush=True)
