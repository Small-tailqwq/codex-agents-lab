---
id: repository-text
title: 仓库文本只描述现状
scene: git
series: 6.1
default: on
evidence: in-use
group: # Global Agent Rules
section: ## Repository Text
note: 比 6.2 版多半句「被否决的方案不是 PR 里要解释的取舍」，针对 GPT-6 系统提示的 Writing PR descriptions 一节；6.2 已删掉那一节。
---
Comments, docs, tests, commits, and PR text describe the repository as it now is.

- Comments give only non-obvious reasons.
- Attempts that never landed, rejected approaches, and anything added and removed within the same task never existed for the repository. Leave them out of all repository text and checks, including tests asserting their absence; a rejected approach is not a tradeoff to explain in a PR. When the user rejects an approach, remove everything added only for it.
- When removing something that already existed, or keeping something out of the repository, describe the change in one neutral line and treat the reason as private unless the user asks for it.
