已移除 `search` 子命令及其实现、专用测试和 README 示例，提交为 `bbce4dd`。工作区干净。

`make test` 的 4 项测试全部通过，实测 CLI 会拒绝 `search`。

另发现一个已有问题：有两条笔记时，`list --limit 1` 会返回两条。