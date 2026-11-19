已修复。`list` 之前按 `limit + 1` 截取结果，现在 `python -m notebox.cli list --limit 5` 实测恰好输出 5 条。

已添加回归测试，全部 6 项测试通过。