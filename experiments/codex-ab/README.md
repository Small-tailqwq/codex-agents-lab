# codex-ab

用 `codex exec` 跑的 AGENTS 对照实验。每组一个隔离的 `CODEX_HOME`，只有全局 `AGENTS.md` 不同。场景、指标和结论见 [6.2 迁移记录](../../research/gpt-6.2-migration.md)。

| 路径 | 内容 |
| --- | --- |
| `run.py` | 跑一个场景一次；场景的提示词都在这个文件里 |
| `batch.py` | 按组、场景、模型、序号批量跑，已有结果的跳过 |
| `tally.py` | 按组统计各项指标 |
| `summ.py` | 汇总每次运行的命令数、耗时、文风命中 |
| `pagetext.py` | 统计 S5 生成页面里的纯英文装饰文字和装饰编号 |
| `arms/` | 各组的 AGENTS：`L` 现行版、`C` 第一版、`C2`、`C3` 定稿。`N` 组没有 AGENTS |
| `fixtures/` | 样例仓库：`notebox`（埋了一个没人提到的 bug）、`notebox_check`、`teahouse` |
| `results/2026-11-18-gpt-6.2/` | 138 次运行，每次一个目录 |

结果目录名是 `<场景>-<组>-<模型>-<强度>-<序号>`，里面是最终回复 `final1.md`（两轮的场景还有 `final2.md`）、相对初始提交的改动 `diff.patch`、元数据 `meta.json`，S5 另有生成的 `index.html`。回复里出现的本机临时目录已替换成 `runs/`。

## 复现

需要 Codex 0.169 以上；npm 的 `@openai/codex` 0.153.4 会被服务端以 `model_not_found` 拒绝 6.2。

```sh
export CODEX_AB_WORK=<仓库外的工作目录>
export CODEX_EXE="C:/Program Files/WindowsApps/OpenAI.Codex_<版本>/app/resources/codex.exe"
# 每组建 $CODEX_AB_WORK/homes/<组名>/：config.toml、auth.json、.env、AGENTS.md（见 arms/）
python batch.py N,L,C3 S1,S2,S7 sol,astra 1,2
python tally.py
python summ.py S2 --full
```

`homes/` 里有登录凭据，工作目录要放在仓库外面。
