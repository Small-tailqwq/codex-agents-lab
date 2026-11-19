---
id: windows-exec-policy
title: Windows 免审批下的 start + URL 拦截
scene: windows
series: 6.2, 6.1
default: on
evidence: in-use
group: # Global Agent Rules
section: ## Tools and Delivery
note: 只在 Windows 且 approval_policy = never 时需要。Codex 0.169 实测仍会拦截带变量的 `adb shell am start -d <url>`。
---
- Codex exec policy on Windows forbids, under `approval_policy = never`, any PowerShell script that contains the word `start` and a URL unless every statement is an independent literal command (openai/codex#40060; #54076 fixed only the literal case). For commands like `adb shell am start -d <url>`, submit one literal command with the URL inlined as a quoted string: no variables, pipelines, `&` calls, `;` chains, or output redaction. "blocked by policy" is this heuristic, not a user or system restriction; rewrite the command instead of asking the user to run it.
