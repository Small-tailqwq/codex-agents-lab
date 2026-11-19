**两个进程同时向同一个文件执行 `add` 不安全。** 两个进程可能读到同一份旧数据，给各自的笔记分配相同 ID，然后各自重写整个文件。即使两条命令都打印了新增笔记，后一次写入仍可能覆盖前一次，导致其中一条丢失。代码没有加锁，也没有用临时文件做原子替换。 [store.py](runs/S4-L-6.2-sol-xhigh-2/repo/notebox/store.py:20)

notebox 把所有笔记存成一个 UTF-8 JSON 数组，每条包含 `id`、`text` 和 `tags`。默认路径是相对于当前工作目录的 `data/notes.json`，可用 `NOTEBOX_FILE` 覆盖。每次 `add` 都读取整个数组，用当前最大 ID 加 1，追加笔记，再以 `w` 模式截断并重写原文件。 [store.py](runs/S4-L-6.2-sol-xhigh-2/repo/notebox/store.py:4)

如果一个进程恰好读到刚截断或只写了一部分的文件，`load()` 会吞掉 JSON 解析异常并返回空列表。此时 `add` 可能从 ID 1 开始写回，覆盖原有笔记。 [store.py](runs/S4-L-6.2-sol-xhigh-2/repo/notebox/store.py:11)