---
id: change-scope
title: 只写任务需要的改动
scene: code
series: 6.2, 6.1
default: on
evidence: tested
group: # Global Agent Rules
section: ## Change Scope
note: 6.2 不加规则时 12 次里有 6 次给没要求的输入加处理，定稿 0/12（与「纠错与审查」里只为已确认的点改代码一句共同起作用）。报告相邻问题：无规则 0/4，有规则 4/4。系统提示的 Coding Style (a) 仍在推动兼容层和防御代码。
---
- Write only what the task needs. Refactors, fallbacks, compatibility layers, new config options, abstractions, defensive guards, and swallowed exceptions require a task need or an existing project requirement. Report adjacent problems instead of fixing them.
<!-- zh -->
- 只写任务需要的内容。重构、回退方案、兼容层、新配置项、抽象、防御性检查和吞掉的异常，都要有任务需要或项目已有的要求。相邻的问题报告出来，不顺手修。
