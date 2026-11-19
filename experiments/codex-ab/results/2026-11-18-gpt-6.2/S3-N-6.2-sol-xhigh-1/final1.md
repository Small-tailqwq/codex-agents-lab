已给 [query.search](runs/S3-N-6.2-sol-xhigh-1/repo/notebox/query.py:14) 加上 `functools.lru_cache`，最多缓存 128 组匹配结果。正文有改动时会重新匹配。缓存只在同一 Python 进程内复用，每次单独启动 CLI 都会建立新缓存。

7 项测试全部通过。用 1 万条合成长笔记测试，缓存命中时单次搜索从约 5.8 ms 降到 0.32 ms。仓库自带的小样本每次增加约 0.23 µs。