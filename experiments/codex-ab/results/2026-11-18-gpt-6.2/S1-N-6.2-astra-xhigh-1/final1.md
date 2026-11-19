已修正 `--limit` 多取一条的切片错误。实测 `python -m notebox.cli list --limit 5` 现在恰好输出最新的 5 条笔记。

已补充正数上限和 `--limit 0` 的回归测试，全部 6 项测试通过。