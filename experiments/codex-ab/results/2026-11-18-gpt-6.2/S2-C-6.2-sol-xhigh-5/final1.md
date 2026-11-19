1. **搜索漏匹配已确认并修复。** 搜索现在对关键词和笔记正文都忽略大小写。`search MILK` 能找到 `buy milk` 和 `Milk for the cat`。[query.py](runs/S2-C-6.2-sol-xhigh-5/repo/notebox/query.py:10)
2. **中文存储损坏的报告不成立。** Windows 实测 `store.save` 直接写入 UTF-8 中文。原样写入和使用 `\uXXXX` 转义的 JSON 都能完整读回正文和标签。
3. **`--limit` 的问题部分属实。** 修复前 `--limit -2` 正常退出，却返回了 11 条笔记，`--limit 1` 也多返回了一条。现在正数按指定上限返回，`0` 不输出笔记，负数会显示参数错误并以状态码 `2` 退出。

9 项测试全部通过，也用实际命令验证了搜索、数量限制和标签筛选。