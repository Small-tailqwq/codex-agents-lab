**两个进程同时对同一个文件执行 `notebox add` 不安全，可能丢笔记。**

notebox 把所有笔记存成一个 UTF-8 JSON 数组，每条包含 `id`、`text` 和 `tags`。默认路径是相对于当前工作目录的 `data/notes.json`，可以用环境变量 `NOTEBOX_FILE` 覆盖。每次 `add` 都会读入整个文件，用当前最大 ID 加 1，追加新笔记，再以 `w` 模式截断并重写整个文件。 [store.py](runs/S4-N-6.2-sol-xhigh-2/repo/notebox/store.py:4)

这个过程没有进程间锁，也没有原子替换。两个进程如果读到同一份旧数据，就会分配相同的 ID。即使两个命令都显示添加成功，后一次重写也可能覆盖前一次新增的笔记。如果一个进程恰好读到另一个进程刚截断或只写了一部分的文件，`load()` 会把解析失败当作空列表，随后写入时甚至可能覆盖原有的全部笔记。 [store.py](runs/S4-N-6.2-sol-xhigh-2/repo/notebox/store.py:11)