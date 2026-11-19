已修复 `--limit` 多输出一条的问题。实测 `python -m notebox.cli list --limit 5` 输出 5 条，`--limit 0` 输出 0 条。

已添加回归测试，全部 6 项测试通过。