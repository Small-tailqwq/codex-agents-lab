已撤掉缓存，修复 `query.search` 的大小写匹配并提交为 `5cad219`。搜索现在对关键词和正文都使用 `casefold()`。

`make test` 的 6 项测试全部通过，命令行搜索 `rEnEw` 能找到 `Renew passport`。工作区干净。