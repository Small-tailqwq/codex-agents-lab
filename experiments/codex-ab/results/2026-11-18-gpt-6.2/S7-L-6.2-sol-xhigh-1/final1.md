已修复。列表查询原先按 `limit + 1` 截取，现在按 `limit` 截取。

用原命令 `python -m notebox.cli list --limit 5` 验证，恰好输出 5 条。新增了条数上限的回归测试，全部 6 项测试通过。