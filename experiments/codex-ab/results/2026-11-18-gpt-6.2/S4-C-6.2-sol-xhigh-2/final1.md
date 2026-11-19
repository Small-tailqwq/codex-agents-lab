**两个进程同时对同一个文件执行 `add` 不安全，可能丢笔记。**

notebox 把所有笔记存在一个 UTF-8 JSON 文件里。默认路径是相对于当前工作目录的 `data/notes.json`，可以用 `NOTEBOX_FILE` 覆盖。文件内容是一个数组，每条笔记有 `id`、`text` 和 `tags` 三个字段。 [store.py](runs/S4-C-6.2-sol-xhigh-2/repo/notebox/store.py:4)

`add` 会先读入整份文件，用当前最大 ID 加一，再把新笔记加到数组末尾，最后以 `w` 模式清空并重写文件。整个过程没有进程间锁。如果两个进程都在写入前读到了最大 ID `12`，它们都会分配 `13`。即使两次写入依次完成，后写入的进程也会用自己的旧副本覆盖整份文件。两条命令都可能报告成功，磁盘上却只留下一条新笔记。 [store.py](runs/S4-C-6.2-sol-xhigh-2/repo/notebox/store.py:20)

如果一个进程恰好在另一个进程清空文件或写到一半时读取，`load()` 会把 JSON 解析错误当成空列表。这个进程随后保存时，还可能把原有笔记一起覆盖掉。 [store.py](runs/S4-C-6.2-sol-xhigh-2/repo/notebox/store.py:11)