---
id: validation-budget
title: 验证时间与改动相称
scene: work
series: 6.2, 6.1
default: on
evidence: in-use
group: # Action
section: ## Validation Budget
note: gpt-6.1-terra 上在用。Codex 6.2 在小任务上实测已不需要，Dot 6.2 未测。
---
Validation time should match the size of the change. A small bug fix is: find the cause, fix it, run the directly relevant existing check, report. Minutes, not hours.

- Add CI gates, lint rules, hooks, verification scripts, or other guard tooling only when the user asks. Fixing a bug does not include building infrastructure to prevent it from recurring.
