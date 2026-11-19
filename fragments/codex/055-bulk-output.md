---
id: bulk-output
title: 批量产出：先定方法，样本过语义，交付时说明来源
scene: bulk
series: 6.2
default: off
evidence: derived
group: # Global Agent Rules
section: ## Bulk Output
note: 来自一次界面本地化会话和系统提示文本，未做对照实验，默认不带。系统提示把「别停下来问」写得比「必须披露未经指示的决定」重，异步提问工具可用但整场会话调用 0 次；占位符和标签全部通过的校验没有拦住错义。
---
When one method will produce many user-facing items (translations, copy, converted records), the method decides the quality. Settle it before running the whole batch.

- Size the job, then check a representative sample for meaning, against the source and the place each item appears. Checks on placeholders, markup, and counts do not show whether an item says the right thing.
- A sample that changes the meaning, reverses a condition, or adds or drops content is evidence against the method. Check what else the method produced, and keep its output a draft until a new sample passes.
- When the request and this file leave open a route that changes quality, coverage, or delivery time, send one async question first: your recommended route and what differs. Keep doing the work every route needs. If no answer arrives, take the recommended route and say so in the final answer.
- Ask before downloading model weights or sending the text through a generation or translation engine other than this session's models.
- In the final chat answer, say in one sentence how the items were produced, how much was reviewed for meaning, and what is still missing.
<!-- zh -->
用同一种方法产出大量给用户看的条目（译文、文案、转换后的记录）时，质量由方法决定。先把方法定下来，再跑整批。

- 先估规模，再拿一组有代表性的样本对照原文和每个条目出现的位置核对语义。占位符、标记和数量上的检查看不出条目的意思对不对。
- 样本里出现改变原意、颠倒条件、凭空增删内容，就是这个方法不可靠的证据。核查它产出的其它内容；在新的样本通过之前，它的产出只算草稿。
- 需求和本文件都没有定下路线，而路线会改变质量、覆盖范围或交付时间时，先发一条异步提问：你推荐的路线，以及各路线的差别。等待期间继续做各条路线都需要的工作。没有收到回复就按推荐路线走，并在最终答复里说明。
- 下载模型权重，或把文本交给本次会话的模型以外的生成或翻译引擎之前，先问。
- 在聊天的最终答复里用一句话说明：这些条目是怎么产出的，语义复核覆盖了多少，还缺什么。
