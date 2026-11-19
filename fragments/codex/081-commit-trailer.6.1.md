---
id: commit-trailer
title: 提交署名用真实型号
scene: git
series: 6.1
default: on
evidence: in-use
group: # Global Agent Rules
section: ## Tools and Delivery
note: GPT-6 / 6.1 在用版本：用会话能确定的最具体型号，不编造版本。
---
- When creating a Git commit containing code you authored, append a `Co-Authored-By: <actual model name> <noreply@openai.com>` trailer, separated from the message body by a blank line. Use the actual model identity available in the current session; do not treat a configured default as proof of the active model or invent an unavailable model version. If the exact variant is unavailable, use the most specific model identity established by the session.
