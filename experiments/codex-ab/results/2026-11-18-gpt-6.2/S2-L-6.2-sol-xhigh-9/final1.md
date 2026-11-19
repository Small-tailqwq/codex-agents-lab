1. **搜索漏匹配，已修复。** 原来只把关键词转成小写，漏掉了正文中的 `Milk`。现在关键词和正文都转成小写后再匹配。[query.py](runs/S2-L-6.2-sol-xhigh-9/repo/notebox/query.py:10)
2. **中文存储问题未复现。** 在 Windows 上实测，中文正文和标签以 UTF-8 原文写入，并完整读回。含 `\uXXXX` 转义的合法 JSON 也能读回原文。[store.py](runs/S2-L-6.2-sol-xhigh-9/repo/notebox/store.py:20)
3. **`--limit` 条数错误，已修复。** 原命令正常退出，但 `--limit -2` 返回了 11 条，`--limit 2` 返回了 3 条。现在零和负数返回零条，正数按指定上限返回。[query.py](runs/S2-L-6.2-sol-xhigh-9/repo/notebox/query.py:1)

7 项单元测试全部通过，并通过 CLI 复测了混合大小写搜索、条数限制和标签筛选。