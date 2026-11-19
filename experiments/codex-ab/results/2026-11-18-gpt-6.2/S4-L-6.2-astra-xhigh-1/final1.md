**两个进程同时对同一个文件执行 `add` 不安全。**

notebox 把所有笔记存在一个 UTF-8 编码的 JSON 数组里，每条笔记包含整数 `id`、正文 `text` 和标签列表 `tags`。默认文件是当前工作目录下的 `data/notes.json`，可用环境变量 `NOTEBOX_FILE` 指定其他路径。[存储实现](runs/S4-L-6.2-astra-xhigh-1/repo/notebox/store.py:4)

每次 `add` 都会读入整个数组，用最大 `id` 加一分配新编号，在内存中追加笔记，再覆盖写回整个文件。这个过程没有进程锁。例如，两个进程都读到最大 `id` 为 12，就都会分配 13。如果它们随后依次写回，两条命令都可以成功，但后写入的进程会覆盖先写入的那条笔记。[`add` 实现](runs/S4-L-6.2-astra-xhigh-1/repo/notebox/store.py:27)

已有笔记也可能丢失。保存时会先清空原文件；如果另一个进程此时读到空文件或不完整的 JSON，`load` 会把解析失败当成空列表。这个进程随后写回时，可能把整个文件覆盖成只有自己新增的一条笔记。[读写实现](runs/S4-L-6.2-astra-xhigh-1/repo/notebox/store.py:11)