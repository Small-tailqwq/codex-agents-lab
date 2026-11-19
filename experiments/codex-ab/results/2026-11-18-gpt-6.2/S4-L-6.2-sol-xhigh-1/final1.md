两个进程同时对**同一个文件**执行 `add` 不安全。假设当前最大 ID 是 `12`，两个进程可能读到同一份数据，都分配 `13`。即使两次命令都显示成功，后写入的进程也可能覆盖先写入的那条笔记。整个读、改、写过程没有跨进程锁。[store.py](runs/S4-L-6.2-sol-xhigh-1/repo/notebox/store.py:27)

notebox 把所有笔记存成一个 UTF-8 JSON 数组，每条包含 `id`、`text` 和 `tags`。默认文件是相对于当前工作目录的 `data/notes.json`，可以用环境变量 `NOTEBOX_FILE` 指定路径。每次 `add` 都读取整个数组，取最大 ID 加一，在内存中追加笔记，然后用 `w` 模式截断原文件并重写整个数组。[store.py](runs/S4-L-6.2-sol-xhigh-1/repo/notebox/store.py:4)

如果一个进程恰好在另一个进程截断文件后、写完之前读取，JSON 解析可能失败。`load()` 会把读取或解析异常当作空列表，此时 `add` 可能从 ID `1` 开始写回，导致旧笔记丢失。[store.py](runs/S4-L-6.2-sol-xhigh-1/repo/notebox/store.py:11)