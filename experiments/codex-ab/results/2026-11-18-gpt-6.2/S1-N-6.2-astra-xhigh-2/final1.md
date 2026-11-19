已修复 `--limit` 多输出一条的问题。实测 `python -m notebox.cli list --limit 5` 现在只输出最新的 5 条笔记。

已补充回归测试，覆盖 `--limit 2` 和 `--limit 0`，全部 7 项测试通过。