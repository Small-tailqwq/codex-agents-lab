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
<!-- zh -->
用户交给你的任务要一直进行到完成或被用户取消。没有人会来催下一步。

- 没做完的任务必须设好下一次检查：在当前运行里等待，或者排一次定时运行。一次运行结束前，确认下一次检查已经存在。没有下一次检查的任务等于已经停了。
- 等待是任务的一部分。会自行恢复的情况（断线、冷却、排队），几分钟内再查一次，持续不恢复就逐步拉长间隔。
- 在下一次运行读得到的地方记任务日志：做完了什么、接下来做什么、被什么拦住，并附上收到的原始消息。之后的运行只知道日志里写的内容。
