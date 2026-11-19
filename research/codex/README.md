# Codex

`~/.codex/AGENTS.md` 的四个版本，都在 [`history/`](history)。

| 文件 | 模型 | 说明 |
| --- | --- | --- |
| `AGENTS.baseline-2026-10-20.md` | GPT-6 Astra | 优化前 |
| `AGENTS.astra-draft-2026-10-22.md` | GPT-6 Astra | 逐条对照系统提示精简后的成品，4.1 KB |
| `AGENTS.live-2026-11-14.md` | GPT-6 Astra | 现行版，Product UI Text 在草稿之后扩成五段。片段库 Codex 6.1 / 6 预设的原文件 |
| `AGENTS.6.2-2026-11-18.md` | GPT-6.2 Sol / Astra | 对照实验的定稿（C3 组），4.1 KB。片段库 Codex 6.2 预设的原文件 |

后两个文件是 `tools/build.py --check` 的校验基准，默认片段必须逐字节拼回它们。逐节改动和依据见 [6.2 迁移记录](../gpt-6.2-migration.md)。
