已修复 `list --limit` 多输出一条的问题。切片上限误写成了 `limit + 1`，现已改为 `limit`。实测 `python -m notebox.cli list --limit 5` 恰好输出最新的 5 条笔记。

已补充回归测试，全部 6 项测试通过。