1. **`query.search` 已确认并修复。** 关键词和笔记正文现在都用 `casefold()` 做无视大小写的匹配。实测 `search RELEASE` 能找到 `Release Checklist`。
2. **`store.save` 的报告未复现。** Windows 实测，文件直接写入 UTF-8 中文，读回内容与原始笔记一致。含 `\uXXXX` 转义的合法 JSON 也能完整读回。
3. **`list --limit` 的崩溃未复现。** `-1`、`-2`、`-3` 均以退出码 `0` 结束。另有一处待修的数量错误：`--limit 1` 在笔记充足时会返回两条。

新增了大小写搜索的回归测试，全部 6 项测试通过。