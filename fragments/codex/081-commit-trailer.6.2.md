---
id: commit-trailer
title: 提交署名用真实型号
scene: git
series: 6.2
default: on
evidence: tested
group: # Global Agent Rules
section: ## Tools and Delivery
note: 系统提示只写 GPT-6，旧版署名 8/8 写成 GPT-6。改为从会话 rollout 文件读型号后 10/10 署名正确。
---
- When creating a Git commit containing code you authored, append a `Co-Authored-By: <model> <noreply@openai.com>` trailer, separated from the message body by a blank line. Take `<model>` from the last `"model"` value in this session's rollout file, `$CODEX_HOME/sessions/**/rollout-*-$CODEX_THREAD_ID.jsonl`. The "GPT-6" in your system prompt and the configured default model are not proof of the active model. When the file cannot be read, use the most specific model identity the session establishes.
