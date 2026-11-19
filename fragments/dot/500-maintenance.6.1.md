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
