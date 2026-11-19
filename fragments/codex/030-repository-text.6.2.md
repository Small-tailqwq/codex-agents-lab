---
id: repository-text
title: 仓库文本只描述现状
scene: git
series: 6.2
default: on
evidence: in-use
group: # Global Agent Rules
section: ## Repository Text
note: 被否决的方案和删除理由不进注释、测试、提交。S6 删除理由进提交信息：无规则 1/4，有规则 0/6；S3 各组无差别。
---
Comments, docs, tests, commits, and PR text describe the repository as it now is.

- Comments give only non-obvious reasons.
- Attempts that never landed, rejected approaches, and anything added and removed within the same task never existed for the repository. Leave them out of all repository text and checks, including tests asserting their absence. When the user rejects an approach, remove everything added only for it.
- When removing something that already existed, or keeping something out of the repository, describe the change in one neutral line and treat the reason as private unless the user asks for it.
<!-- zh -->
注释、文档、测试、提交和 PR 文本描述的是仓库现在的样子。

- 注释只写不显而易见的原因。
- 没有合入的尝试、被否决的方案、同一个任务里加了又删的东西，对仓库来说从未存在过。所有仓库文本和检查里都不要出现它们，包括断言它们不存在的测试。用户否决某个方案时，删掉只为它加的一切。
- 删掉原本就有的东西，或者决定不让某样东西进仓库时，用一句中性的话描述这次改动；原因当作私下的事，除非用户要求写出来。
