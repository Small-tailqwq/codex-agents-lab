已修复 `list --limit` 多输出一条的问题。原因是查询按 `limit + 1` 截取结果，现在直接按 `limit` 截取。

实测 `python -m notebox.cli list --limit 5` 恰好输出 5 条。已补上回归测试，全部 6 个测试通过。