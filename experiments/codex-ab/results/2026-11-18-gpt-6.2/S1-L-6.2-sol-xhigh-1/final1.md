已修复 `list` 多输出一条的问题。查询现在按 `--limit` 指定的数量截取结果。 [query.py](runs/S1-L-6.2-sol-xhigh-1/repo/notebox/query.py:6)

实测 `python -m notebox.cli list --limit 5` 输出 5 条。新增回归测试，全部 6 项测试通过。