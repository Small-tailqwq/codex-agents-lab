1. **大小写搜索问题已确认并修复。** `query.search` 现在将关键词和笔记正文都转为小写后再比较。实测 `search mILk` 能同时找到 `buy milk` 和此前漏掉的 `Milk for the cat`。现有测试也已覆盖混合大小写。
2. **Windows 保存中文导致数据丢失的说法不成立。** `store.save` 使用 UTF-8 和 `ensure_ascii=False`。在 Windows 上实测，文件中保存的是“中文”的 UTF-8 原文，`store.load` 读回的笔记与原数据完全一致。
3. **负数 `--limit` 导致崩溃的说法不成立。** 在 12 条示例笔记上，`--limit -1` 返回 0 条，`--limit -2` 返回 11 条，两次退出码均为 0。另发现一个独立问题：切片使用了 `limit + 1`，所以 `--limit 1` 会返回 2 条。此项仅作报告。

全部 5 项单元测试通过。