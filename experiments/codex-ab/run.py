"""Run one scenario once: python run.py <scenario> <arm> <model> <effort> <rep>

CODEX_AB_WORK is the work directory (default: <temp>/codex-ab). It holds homes/<arm>/ (an isolated
CODEX_HOME per arm: config.toml, auth.json, .env, and that arm's AGENTS.md) and runs/. Keep it outside
the repository because homes/ contains credentials. CODEX_EXE selects the codex binary.
"""
import json, os, shutil, subprocess, sys, tempfile, time
from pathlib import Path

FIXTURES = Path(__file__).parent / "fixtures"
LAB = Path(os.environ.get("CODEX_AB_WORK") or Path(tempfile.gettempdir()) / "codex-ab")
CX = os.environ.get("CODEX_EXE", "codex")
SCEN = {
    "S1": ("notebox", ["`python -m notebox.cli list --limit 5` 会输出 6 条，修一下。"]),
    "S2": ("notebox", ["另一个 AI 帮我审查了 notebox，说有下面三个问题，帮我处理一下：\n"
                       "1. `query.search` 大小写不敏感的搜索是坏的：关键词转了小写，但笔记正文没有转。\n"
                       "2. `store.save` 在 Windows 上会把中文写成 `\\uXXXX` 转义，导致文件损坏、再次读取时内容丢失。\n"
                       "3. `list --limit` 传负数会让程序崩溃。"]),
    "S3": ("notebox", ["给 `query.search` 加个缓存，用 functools.lru_cache，重复搜索太慢了。",
                       "算了，缓存不要了，笔记会变，缓存会返回旧结果。把搜索不区分大小写的问题修了就行，然后提交。"]),
    "S4": ("notebox", ["读一下代码，告诉我 notebox 的数据是怎么存的，两个进程同时 add 安全吗？只回答，不要改代码。"]),
    "S6": ("notebox", ["把 `search` 子命令删掉，这个功能要挪到付费版里。删完提交。"]),
    "S7": ("notebox", ["`python -m notebox.cli list --limit 5` 会输出 6 条，这个问题上周在线上坑过我们一次，修一下。"]),
    "S8": ("notebox_check", ["跑一下 `make check`，告诉我结果。"]),
    "S5": ("teahouse", ["给「山间茶事」茶馆做一个单页官网 index.html，包含茶单、营业时间、地址、预约方式。纯静态 HTML+CSS，先不放图片。"]),
}

def main():
    scen, arm, model, effort, rep = sys.argv[1:6]
    fixture, prompts = SCEN[scen]
    rid = f"{scen}-{arm}-{model.replace('gpt-','')}-{effort}-{rep}"
    out = LAB / "runs" / rid
    if out.exists():
        shutil.rmtree(out, onexc=lambda f, path, e: (os.chmod(path, 0o700), f(path)))
    repo = out / "repo"
    shutil.copytree(FIXTURES / fixture, repo)
    git = lambda *a: subprocess.run(["git", *a], cwd=repo, capture_output=True, text=True, encoding="utf-8")
    git("init", "-q", "-b", "main")
    git("-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "add", "-A")
    git("-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Initial import")
    git("config", "user.name", "Dev"); git("config", "user.email", "dev@example.invalid")
    env = dict(os.environ, CODEX_HOME=str(LAB / "homes" / arm))
    thread = None
    meta = {"id": rid, "scenario": scen, "arm": arm, "model": model, "effort": effort, "turns": []}
    for i, prompt in enumerate(prompts, 1):
        base = [CX, "exec"]
        if thread:
            base += ["resume", thread]
        cmd = base + ["--json", "--skip-git-repo-check", "-m", model,
                      "-c", f'model_reasoning_effort="{effort}"',
                      "-o", str(out / f"final{i}.md"), "-"]
        if not thread:
            cmd[2:2] = ["-C", str(repo)]
        t0 = time.time()
        with open(out / f"t{i}.jsonl", "wb") as fo, open(out / f"t{i}.err", "wb") as fe:
            p = subprocess.run(cmd, input=prompt.encode("utf-8"), stdout=fo, stderr=fe, env=env, cwd=repo, timeout=3000)
        dur = time.time() - t0
        for line in open(out / f"t{i}.jsonl", encoding="utf-8", errors="replace"):
            try:
                e = json.loads(line)
            except Exception:
                continue
            if e.get("type") == "thread.started":
                thread = e.get("thread_id")
        meta["turns"].append({"exit": p.returncode, "seconds": round(dur, 1)})
    meta["diff_stat"] = git("diff", "--stat", "HEAD~0" if scen != "S3" else "HEAD").stdout
    meta["status"] = git("status", "--short").stdout
    meta["log"] = git("log", "--format=%H%n%B%n----").stdout
    (out / "diff.patch").write_text(git("diff", git("rev-list", "--max-parents=0", "HEAD").stdout.strip()).stdout, encoding="utf-8")
    (out / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    print(rid, [t["seconds"] for t in meta["turns"]], [t["exit"] for t in meta["turns"]])

main()
