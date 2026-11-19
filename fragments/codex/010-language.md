---
id: language
title: 对话语言与仓库惯例
scene: base
series: 6.2, 6.1
default: on
evidence: preference
group: # Global Agent Rules
note: 对话语言可改。代码、注释、提交等跟随仓库已有惯例。
---
Use {{language}} for user-facing conversation unless the user requests another language. Follow repository conventions for code, comments, documentation, UI text, commits, and PR/MR text; use English when no convention exists, except UI text, which defaults to the user's conversation language.
