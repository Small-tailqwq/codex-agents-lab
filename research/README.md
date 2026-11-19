# 研究记录

2026-10 至 11 月调试 Codex 和 Dot 的 AGENTS 提示词留下的材料。片段库里每个片段的依据都出自这里。

| 路径 | 内容 |
| --- | --- |
| [`gpt-6.2-migration.md`](gpt-6.2-migration.md) | GPT-6.2 Sol / Astra 迁移：系统提示对比、138 次对照实验、Codex AGENTS 逐节取舍、Dot 的改动 |
| [`codex/`](codex/README.md) | Codex 全局 AGENTS 的四个历史版本 |
| [`dot/`](dot/README.md) | Dot 的板块划分、授权场景写法、两版确认策略对照、作者实际使用的版本 |
| [`dsh/`](dsh/README.md) | DSH（DeepSeek Harness）上的中文版规则与长会话漂移实验 |
| [`../experiments/codex-ab/`](../experiments/codex-ab/README.md) | 对照实验的脚本、样例仓库和每次运行的结果 |

## 时间线

| 日期 | 事件 |
| --- | --- |
| 2026-10-20 | Codex AGENTS 优化前的基线 |
| 2026-10-22 | GPT-6 Astra 上逐条对照系统提示精简，加入 Repository Text 和 Product UI Text。同期在 DSH 上做长会话英文思考漂移实验 |
| 2026-11-13 | Dot 的 AGENTS 写成模块化板块 |
| 2026-11-14 | 存档 Codex 现行版，Product UI Text 一节在草稿之后扩成了五段 |
| 2026-11-18 | 迁移到 GPT-6.2：删掉文风和验证时长两节，纠错一节加一句。Dot 核对两版确认策略 |
| 2026-11-19 | 拆成片段库，按产品和模型系列区分 |

## 结论

- 规则只留两类：系统提示已写但模型仍照犯的，和个人偏好。
- 聪明模型靠泛化，规则不必举具体例子；AGENTS 内部不能互相矛盾。
- 不要往 AGENTS 里写「为什么不要 X」的具体例子，例子本身会被模型复述。
- GPT-6.2 的系统提示自己管住了文风和验证时长，这两节可以不写；过度防御和对转发意见照单全收仍要靠 AGENTS。
- 长会话里模型自己写的英文越多，思考越偏英文；往回合末尾加锚点补丁反而更糟（DSH 上的实验）。
