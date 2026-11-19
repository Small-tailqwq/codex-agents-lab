已修复。笔记列表原先按 `limit + 1` 截取，现在按 `limit` 截取。 [query.py](runs/S7-C-6.2-sol-xhigh-1/repo/notebox/query.py:6)

实测 `python -m notebox.cli list --limit 5` 输出 5 条，`--limit 0` 输出 0 条。新增了回归测试，全部 6 项测试通过。