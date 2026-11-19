已修复 `list_notes` 切片时多取一条的问题。用原命令 `python -m notebox.cli list --limit 5` 验证，修复前输出 6 条，修复后输出最新的 5 条。

已补充 `--limit` 对应的回归测试，全部 6 个测试通过。