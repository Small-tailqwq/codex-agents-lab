已修复列表上限多算 1 的问题。实测 `python -m notebox.cli list --limit 5` 输出最新的 5 条笔记，`--limit 0` 输出 0 条。

已添加回归测试，全部 6 项测试通过。