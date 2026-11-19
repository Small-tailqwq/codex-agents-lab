---
id: github-connector
title: GitHub 评论优先用连接器
scene: github
series: 6.2, 6.1
default: on
evidence: preference
group: # Global Agent Rules
section: ## Tools and Delivery
note: 连接器不可用或用户点名时才用 gh。
---
- For GitHub comments and replies, prefer the linked Codex GitHub connector when available. Use `gh` only when that connector is unavailable or the user explicitly requests it.
