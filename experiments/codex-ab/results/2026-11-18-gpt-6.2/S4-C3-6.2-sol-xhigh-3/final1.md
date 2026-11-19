**两个进程同时对同一个文件执行 `add` 不安全。** 两边可能读到同一份旧数据，分配出相同的 ID，然后各自重写整个文件。即使两条命令都打印了新增笔记，后一次完整写入也可能覆盖前一次，导致其中一条丢失。整个读、改、写过程没有跨进程锁。 [store.py](runs/S4-C3-6.2-sol-xhigh-3/repo/notebox/store.py:27)

**存储方式**是一个 UTF-8 JSON 文件，默认是当前工作目录下的 `data/notes.json`，可用 `NOTEBOX_FILE` 指定路径。文件顶层是数组，每条笔记包含 `id`、`text` 和 `tags`。`add` 先读入整个数组，用现有最大 ID 加一，再追加笔记，用 `w` 模式截断并重写原文件。 [store.py](runs/S4-C3-6.2-sol-xhigh-3/repo/notebox/store.py:4)

还有一种丢数据的情况：如果一个进程恰好读到另一个进程刚截断或只写了一部分的文件，`load()` 会把读取或解析异常当成空列表。这个进程随后可能把只包含新笔记的数组写回去，覆盖原有笔记。 [store.py](runs/S4-C3-6.2-sol-xhigh-3/repo/notebox/store.py:11)