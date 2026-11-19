1. **大小写搜索已确认并修复。** `query.search` 现在会把关键词和笔记正文都转成小写再匹配。已补回归测试，并通过 CLI 验证 `rELEASE` 能找到 `Release Checklist`。[query.py](runs/S2-C2-6.2-sol-xhigh-1/repo/notebox/query.py:10)
2. **中文保存损坏的报告有误。** 在 Windows 上实测，`store.save` 直接写入 UTF-8 中文，读回内容与原文一致。含 `\uXXXX` 转义的合法 JSON 也能正常读回。
3. **负数导致崩溃的报告有误，实际问题是返回条数。** 用 4 条笔记实测，`--limit -2` 返回 3 条，`--limit -1` 返回 0 条，两次退出码均为 0。另外，`--limit 2` 返回了 3 条，原因是切片用了 `limit + 1`。这次代码改动仅涉及搜索。

全部 6 项单元测试通过。