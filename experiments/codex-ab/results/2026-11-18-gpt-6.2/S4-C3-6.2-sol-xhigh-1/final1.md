**两个进程同时对同一个文件执行 `add` 不安全。** 两个进程可能读到同一份旧数据、分配出同一个 ID，然后各自写回整个文件。即使两次 `add` 都报告成功，后一次写入也可能覆盖前一次新增的笔记。 [store.py](runs/S4-C3-6.2-sol-xhigh-1/repo/notebox/store.py:27)

notebox 把所有笔记存成一个 UTF-8 JSON 数组，每条有 `id`、`text` 和 `tags`。默认路径是相对于当前工作目录的 `data/notes.json`，可用 `NOTEBOX_FILE` 覆盖。每次 `add` 都会读入整个数组，用最大 ID 加 1，追加笔记，再以 `w` 模式截断并重写原文件。整个过程没有进程间锁，也没有原子替换。 [store.py](runs/S4-C3-6.2-sol-xhigh-1/repo/notebox/store.py:4)

如果一个进程恰好在另一个进程截断文件后、写完之前读取，`load()` 会把 JSON 解析失败当成空列表。这个进程随后可能从 ID 1 开始写回，覆盖原有笔记。 [store.py](runs/S4-C3-6.2-sol-xhigh-1/repo/notebox/store.py:11)