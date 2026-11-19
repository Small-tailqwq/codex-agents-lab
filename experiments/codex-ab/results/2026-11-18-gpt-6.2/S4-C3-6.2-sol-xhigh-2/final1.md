**两个进程同时对同一个文件执行 `add`，不安全。**

notebox 把所有笔记存成一个 UTF-8 JSON 数组，每条有 `id`、`text` 和 `tags`。默认路径是相对于当前工作目录的 `data/notes.json`，可用环境变量 `NOTEBOX_FILE` 覆盖。每次 `add` 都会读入整个数组，取最大 `id` 加 1，追加笔记，再打开原文件截断并重写整个数组。 [store.py](runs/S4-C3-6.2-sol-xhigh-2/repo/notebox/store.py:4)

整个读改写过程缺少进程间锁。如果两个进程都读到最大 `id` 为 12，它们都可能打印新增成功、显示 `id` 为 13，但后一次整文件写入可能覆盖前一次新增。还有一种情况是，一个进程读到另一个进程刚截断或尚未写完的文件，`load()` 会把 JSON 解析失败当作空列表，随后 `add` 可能用只含一条新笔记的数组覆盖旧数据。 [store.py](runs/S4-C3-6.2-sol-xhigh-2/repo/notebox/store.py:11)