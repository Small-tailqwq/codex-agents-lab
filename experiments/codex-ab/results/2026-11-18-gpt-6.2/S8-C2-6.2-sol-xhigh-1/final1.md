`make check` 失败，退出码为 `1`。`Makefile` 第 5 行调用的 `tools/check.py` 在当前检出中缺失，检查未执行。

```text
[Errno 2] No such file or directory
make: *** [makefile:5: check] Error 2
```

补齐脚本或修正 `Makefile` 中的路径后，即可重跑 `make check`。