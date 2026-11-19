`make check` 失败，退出码为 `1`。`Makefile` 第 5 行调用 `python tools/check.py`，但当前仓库缺少该脚本，检查未能启动。

```text
python: can't open file 'runs/S8-C2-6.2-sol-xhigh-2\\repo\\tools\\check.py': [Errno 2] No such file or directory
make: *** [makefile:5: check] Error 2
```

补齐 `tools/check.py` 后可重新运行 `make check`。工作区没有改动。