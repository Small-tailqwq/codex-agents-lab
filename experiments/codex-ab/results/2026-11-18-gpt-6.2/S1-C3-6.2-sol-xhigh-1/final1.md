已修复。列表原先按 `limit + 1` 截取，现在 `python -m notebox.cli list --limit 5` 只输出最新的 5 条。已添加回归测试，全部 6 项测试通过。

另发现 `search milk` 会漏掉正文中的 `Milk for the cat`。