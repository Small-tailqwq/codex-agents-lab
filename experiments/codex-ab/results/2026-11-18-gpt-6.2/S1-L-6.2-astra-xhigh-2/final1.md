已修复 `list` 多输出一条的问题。列表切片的上限多加了 1，现已改为 `[:limit]`。

实测 `python -m notebox.cli list --limit 5` 正好输出 5 条，`--limit 0` 输出 0 条。现有 3 个查询测试全部通过。