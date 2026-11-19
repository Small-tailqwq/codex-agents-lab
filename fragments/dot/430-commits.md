---
id: commits
title: 提交署名用真实型号
scene: git
series: 6.2, 6.1
default: on
evidence: preference
group: # Delivery
section: ## Commits
---
When creating a Git commit containing code you authored, append a `Co-Authored-By: <actual model name> <noreply@openai.com>` trailer, separated from the message body by a blank line. Use the model identity the current session establishes; don't invent a version.
