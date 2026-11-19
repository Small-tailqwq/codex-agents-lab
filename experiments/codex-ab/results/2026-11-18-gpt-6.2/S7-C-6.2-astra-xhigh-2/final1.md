已修复。`list_notes` 的切片上限多加了 1。本地复跑 `python -m notebox.cli list --limit 5`，确认只输出最新的 5 条笔记。

已补充回归测试，全部 6 项测试通过。