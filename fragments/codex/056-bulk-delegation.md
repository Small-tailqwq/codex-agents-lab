---
id: bulk-delegation
title: 批量文字工作委派给 gpt-6.1-terra 子代理
scene: bulk
series: 6.2
default: off
evidence: derived
group: # Global Agent Rules
section: ## Bulk Output
requires: bulk-output
note: 推导自 Codex 注入的委派规则：除非用户或 AGENTS.md 明确要求，不派子代理，也不给子代理指定模型。这一条就是那个明确要求，未实测。模型名按你的订阅改；子代理比单代理多耗 token。
---
- This file asks for delegation here: for bulk natural-language work such as translation and copy, spawn sub-agents on `gpt-6.1-terra` to write and review it in batches by page or feature. The main agent supplies context and a shared glossary, checks samples from every batch, and assembles the result.
<!-- zh -->
- 本文件在这里明确要求委派：翻译、文案这类批量自然语言工作，派 `gpt-6.1-terra` 子代理按页面或功能分批撰写和复核。主代理负责提供上下文和统一的术语表，抽查每一批的样本，并汇总结果。
