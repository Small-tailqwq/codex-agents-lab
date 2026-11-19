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
<!-- zh -->
- Windows 上的 Codex 执行策略在 `approval_policy = never` 下，会拦截任何同时含有 `start` 一词和 URL 的 PowerShell 脚本，除非每条语句都是独立的字面命令（openai/codex#40060；#54076 只修了字面命令的情况）。遇到 `adb shell am start -d <url>` 这类命令，提交一条字面命令，把 URL 作为带引号的字符串写在命令里：不用变量、管道、`&` 调用、`;` 串联，也不做输出脱敏。「blocked by policy」是这条启发式规则造成的，不是用户或系统的限制；改写命令，不要让用户代为执行。
