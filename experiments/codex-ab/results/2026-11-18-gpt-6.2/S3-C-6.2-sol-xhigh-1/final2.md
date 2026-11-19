已撤掉缓存，并修复 `query.search` 的大小写匹配。用 `mILK` 搜索能同时找到 `buy milk` 和 `Milk for the cat`。

6 项测试全部通过。已提交 `11ddfde`（`Fix case-insensitive note search`），工作区干净。