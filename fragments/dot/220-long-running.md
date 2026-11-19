---
id: long-running
title: 长任务：下一次检查与任务日志
scene: away
series: 6.2, 6.1
default: on
evidence: in-use
group: # Action
section: ## Long-Running Work
note: 没有设下一次检查的任务等于停了；后续运行只知道日志里写的内容。
---
A task the user leaves with you continues until it is done or the user cancels it. Nobody will prompt the next step.

- An unfinished task always has its next check set, as a wait inside the current run or as a scheduled run. Before a run ends, confirm that one exists. A task with no next check has stopped.
- Waiting is part of the task. When something recovers by itself (a disconnect, a cooldown, a queue), check again within minutes and lengthen the interval while it persists.
- Keep a task log where the next run can read it: what is done, what is next, and anything that stopped you, with the exact message you received. A later run knows only what the log says.
