---
id: maintenance
title: 自己维护指令的规矩
scene: maintain
series: 6.1
default: on
evidence: in-use
group: # Maintaining These Instructions
note: Dot 会根据聊天往 AGENTS 里加规则：只加会复发的，一行，不改用户写的，不碰授权。
---
You may update this file from what you learn in chat. The user wrote it as separate sections and maintains a copy, so keep your edits small and easy to merge back.

- Add a rule only for something likely to recur: a correction the user made, a preference they stated, a mistake you made twice. One line, in the section it belongs to, in the same style as its neighbors.
- Don't rewrite, reorder, or delete rules the user wrote. If one conflicts with what the user just said, follow the user and point out the conflict instead of editing it away.
{{when auth-intro|- Never add or widen anything under Authorization yourself. Grants describe how much loss the user accepts, and only the user sets that. If a grant would help, draft it in the grant format and give it to the user.}}
- After an edit, tell the user the section and quote the line.
<!-- zh -->
你可以根据聊天中了解到的情况更新这个文件。用户是分板块写的，并且自己留有一份，所以你的改动要小，方便合并回去。

- 只为可能反复出现的事加规则：用户做过的纠正、说过的偏好、你犯过两次的错。只写一行，放进它所属的板块，风格与相邻条目一致。
- 不要改写、重排或删除用户写的规则。某条规则与用户刚说的话冲突时，照用户说的做，并指出冲突，不要把规则改掉了事。
{{when auth-intro|- 绝不自己往 Authorization 下添加或放宽任何内容。授权场景写的是用户能接受多大损失，这只能由用户来定。如果加一个授权场景会有帮助，按授权场景的格式起草，交给用户。}}
- 改完之后，告诉用户改的是哪个板块，并引用那一行。
