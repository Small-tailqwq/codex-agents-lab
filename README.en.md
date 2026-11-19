# codex-agents-lab

A library of AGENTS.md rule fragments for Codex and Dot, with the experiments behind them. Each rule is labeled by where it came from: an A/B experiment, daily use, a reading of the system prompt, or personal preference.

[中文](README.md) · [Composer page](https://small-tailqwq.github.io/codex-agents-lab/)

The research was done in Chinese, for Chinese-language use. The fragments are written in English and take the conversation language as a parameter. The rules about Chinese phrasing drop out when another language is chosen. Notes and experiment records are in Chinese.

## Which file

Rules follow the model. The GPT-6.2 system prompt already handles writing style and validation effort, so rules for those only take up space on 6.2.

| | GPT-6.2 (Sol, Astra) | GPT-6.1 / 6 (Terra, GPT-6 Astra) |
| --- | --- | --- |
| **Codex** | [presets/codex-6.2](presets/codex-6.2/AGENTS.md), 4.1 KB<br>final version from 138 A/B runs | [presets/codex-6.1](presets/codex-6.1/AGENTS.md), 5.7 KB<br>in use on GPT-6 Astra |
| **Dot** | [presets/dot-6.2](presets/dot-6.2/AGENTS.md), 9.2 KB<br>derived, untested | [presets/dot-6.1](presets/dot-6.1/AGENTS.md), 8.8 KB<br>in use on gpt-6.1-terra |

Dot presets contain no authorization grants. Those are yours to write.

## Three ways to use it

- **Compose on the page.** Pick the product, the model series, and the scenes that match how you work. The file updates as you go. A Chinese rendering can be shown under each line; it is for reading only and never goes into the file.
- **Let the model do it.** [`skills/agents-composer`](skills/agents-composer) is a skill that asks a few multiple-choice questions, assembles the file from the catalog, and installs it after you approve.

  ```sh
  python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
    --repo Small-tailqwq/codex-agents-lab --path skills/agents-composer
  ```

- **Take a preset.** The four files above work as they are. Change the conversation language in the first sentence.

## Principles

- A rule stays for one of two reasons: the model still gets it wrong although the system prompt covers it, or it is a personal preference.
- State principles and leave out incidents. A story about what went wrong gets repeated back.
- No contradictions inside the file, and no references to sections that are not there.
- Re-audit on every model change. Drop what the new system prompt now enforces, keep what it pushes against.
- Measure when possible: the same small task with and without the rule, a few runs, direction only.
- Length is a cost.
- Authorization is written by the user. The model never adds to it.

## Evidence labels

| Label | Meaning |
| --- | --- |
| 实测 tested | Backed by A/B data |
| 在用 in-use | From problems that kept recurring in real sessions; no controlled comparison |
| 推导 derived | Reasoned from the system prompt or platform policy; untested |
| 偏好 preference | Personal preference |

## Layout

| Path | Contents |
| --- | --- |
| `fragments/` | The source of truth: one file per fragment, with series, evidence, and rationale in the header |
| `presets/` | Four full presets generated from the fragments |
| `skills/agents-composer/` | The skill |
| `docs/` | The composer page (GitHub Pages) |
| `tools/build.py` | Generates presets, page data, and the skill's catalog; `--check` verifies them |
| `research/` | Migration notes, earlier versions, Dot authorization policy comparison, DSH experiments |
| `experiments/codex-ab/` | `codex exec` A/B harness, fixtures, arms, and per-run results |

## License

[MIT](LICENSE)
