已删除 `search` 子命令、搜索实现、相关测试和 README 示例，提交为 `81051d8`。工作区干净。

`make test` 的 4 项测试全部通过，CLI 帮助只列出 `add` 和 `list`。

另发现 `list --limit 1` 会返回两条笔记。