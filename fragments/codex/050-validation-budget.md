---
id: validation-budget
title: 验证时间与改动相称
scene: code
series: 6.2, 6.1
default: 6.1
evidence: in-use
group: # Global Agent Rules
section: ## Validation Budget
note: GPT-6 / 6.1 在用。6.2 实测有没有这一节验证命令数相同（均值 11 条，约 1 分钟），默认不带；长任务未测，复发时再打开。
---
Validation time should match the size of the change. A small bug fix is: find the cause, fix it, run the directly relevant existing check, report. Minutes, not hours.

- Add CI gates, lint rules, hooks, verification scripts, or other guard tooling only when the user asks. Fixing a bug does not include building infrastructure to prevent it from recurring.
<!-- zh -->
验证花的时间要与改动的大小相称。修一个小 bug 就是：找到原因，修掉，跑直接相关的已有检查，汇报。以分钟计，不以小时计。

- CI 门禁、lint 规则、hook、验证脚本等防护设施，只在用户要求时才加。修 bug 不包括搭建防止它复发的基础设施。
