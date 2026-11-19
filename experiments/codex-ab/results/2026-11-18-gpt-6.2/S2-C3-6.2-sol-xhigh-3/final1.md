1. **已确认并修复 `query.search`。** 现在关键词和笔记正文都会转成小写再匹配。用 `search mILk` 验证，能同时找到 `buy milk` 和 `Milk for the cat`。[query.py](runs/S2-C3-6.2-sol-xhigh-3/repo/notebox/query.py:10)
2. **未确认 `store.save` 会丢失中文。** Windows 实测写入的是原始 UTF-8 中文，读回内容完全一致。含 `\uXXXX` 转义的 JSON 也能正确读回。
3. **未确认负数 `--limit` 会崩溃。** `--limit -1` 和 `--limit -2` 均以状态码 0 退出。另发现一处计数错误，切片使用了 `limit + 1`，所以 `--limit 1` 在有足够笔记时会返回两条。

全部 6 项测试通过，包含新增的大小写搜索回归测试。