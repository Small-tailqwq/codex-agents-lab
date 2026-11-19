# 片段

一个文件一个片段。`codex/` 和 `dot/` 各自一套，文件名开头的数字决定它在 AGENTS.md 里的位置。同一个片段在两个模型系列上写法不同时拆成两个文件，例如 `060-corrections.6.2.md` 和 `060-corrections.6.1.md`。

## 文件头

```
---
id: corrections
title: 被纠正或收到转发意见时先核实
scene: review
series: 6.2
default: on
evidence: tested
group: # Global Agent Rules
section: ## Corrections and Pushback
note: 依据，一两句话
---
正文
```

| 字段 | 含义 |
| --- | --- |
| `id` | 同一目录内唯一；两个系列的变体共用一个 id |
| `title`、`note` | 展示页和 skill 里给人看的标题与依据 |
| `scene` | 所属使用场景，场景列表在各目录的 `_target.json` |
| `series` | 这段文字适用的系列：`6.2`、`6.1`（含 GPT-6），或两者 |
| `default` | `on`、`off`，或只在某个系列默认带上（如 `6.1`） |
| `evidence` | `tested` 实测、`in-use` 在用、`derived` 推导、`preference` 偏好 |
| `group`、`section` | 正文前的一级、二级标题。相邻片段标题相同时只输出一次 |
| `locale: zh` | 只在对话语言是中文时可用 |
| `requires` | 选中它时必须一起带上的片段 |
| `with` | 不能单独勾选，列出的片段有任何一个被选中时自动带上；`kind:grant` 指任意授权场景 |
| `kind: grant` | 这是一个授权场景 |

## 正文里的占位

- `{{language}}`：对话语言。
- `{{when 键|甲|乙}}`：键是 `zh`（对话语言为中文）或另一个片段的 id。条件成立输出甲，否则输出乙，乙可以不写。整行因此变空时删掉这一行。用来处理中文例句和对其它章节的引用。

## 生成与校验

改完运行 `python tools/build.py`。`python tools/build.py --check` 会确认默认片段仍能逐字节拼回实验里用的原文件（见 `tools/build.py` 里的 `SNAPSHOTS`），所以改动已测过的片段会让校验失败。这是有意的：先决定这次改动要不要重新测，再更新对应的原文件。
