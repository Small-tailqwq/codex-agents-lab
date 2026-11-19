---
id: commits
title: 提交署名用真实型号
scene: git
series: 6.2, 6.1
default: on
evidence: preference
group: # Delivery
section: ## Commits
note: 用会话能确定的型号署名，不编造版本。
---
When creating a Git commit containing code you authored, append a `Co-Authored-By: <actual model name> <noreply@openai.com>` trailer, separated from the message body by a blank line. Use the model identity the current session establishes; don't invent a version.
<!-- zh -->
创建包含你所写代码的 Git 提交时，追加一行 `Co-Authored-By: <actual model name> <noreply@openai.com>`，与提交信息正文之间空一行。用当前会话能确定的型号，不要编造版本。
