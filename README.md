# codex-agents-lab

给 Codex 和 Dot 写 AGENTS.md 的片段库，以及得出这些片段的实验记录。每条规则都标了来历：对照实验测出来的、日常用出来的、从系统提示推出来的，还是纯个人偏好。

[English](README.en.md) · [展示页](https://small-tailqwq.github.io/codex-agents-lab/)

## 用哪一份

规则跟模型走。GPT-6.2 的系统提示已经管住了文风和验证时长，同样的规则放在 6.2 上只是占地方，所以片段按产品和模型系列分成四份。

| | GPT-6.2（Sol、Astra） | GPT-6.1 / 6（Terra、GPT-6 Astra） |
| --- | --- | --- |
| **Codex** | [presets/codex-6.2](presets/codex-6.2/AGENTS.md)，4.1 KB<br>对照实验定稿，138 次运行 | [presets/codex-6.1](presets/codex-6.1/AGENTS.md)，5.7 KB<br>GPT-6 Astra 上的现行版 |
| **Dot** | [presets/dot-6.2](presets/dot-6.2/AGENTS.md)，9.2 KB<br>推导，未实测 | [presets/dot-6.1](presets/dot-6.1/AGENTS.md)，8.8 KB<br>gpt-6.1-terra 上在用 |

预设是全量版。Dot 的预设不带授权场景，放多大的权只能由你自己写。

## 三种用法

**在展示页上搭。** 打开[展示页](https://small-tailqwq.github.io/codex-agents-lab/)，选产品和模型系列，勾上自己的使用场景，右边实时出 AGENTS.md，复制或下载。片段是英文写的，每一行下面可以显示中文对照；对照只在页面上看，不进文件。Dot 的授权场景可以直接在页面上填。

**让模型来配。** [`skills/agents-composer`](skills/agents-composer) 是一个 skill：模型问你几个选择题，从片段库里拼出 AGENTS.md，给你看过再安装。你原有的规则它会保留，并按下面的设计哲学过一遍。

```sh
# Codex：装进 ~/.codex/skills
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo Small-tailqwq/codex-agents-lab --path skills/agents-composer
```

装好后在新会话里说 `$agents-composer 帮我配置 AGENTS.md`。Dot 没有验证过安装入口：把 `skills/agents-composer` 目录交给它读即可，生成的全文由你自己贴进 Dot。

**直接拿预设。** 上表里的四个文件可以原样使用，把第一句里的对话语言改成你的。

## 6.2 和 6.1 / 6 差在哪

以 Codex 为例，依据见 [6.2 迁移记录](research/gpt-6.2-migration.md)。

| 规则 | GPT-6.1 / 6 | GPT-6.2 |
| --- | --- | --- |
| 中文文风（防御性表述、行话） | 需要 | 不带。不加规则 36 条回复命中 0 次 |
| 验证时间与改动相称 | 需要 | 不带。有没有这一节，验证命令数相同 |
| 只写任务需要的改动 | 需要 | 仍然需要。不加规则 12 次里 6 次给没要求的输入加处理 |
| 被纠正或收到转发意见时先核实 | 需要 | 仍然需要，并多一句「只为已确认的点改代码」 |
| 界面文案 | 五段 | 三条，系统提示已有的限制性条目删掉 |
| 工具失败 | 先换路，再带报错原文报告 | 只留带报错原文，换路那半句没有效果 |
| 提交署名 | 用会话能确定的型号 | 从会话 rollout 文件读型号，系统提示里只写 GPT-6 |

Dot 的 6.1 版是日常在用的版本。6.2 版在它上面加了三处，都标为推导：纠错一节的「只为已确认的点改代码」、默认边界里的「留有选择时做可逆假设并继续」、维护一节的「自己加的授权不起作用」。Dot 的授权写法随模型的确认策略而变，见 [research/dot](research/dot/README.md)。

没验证的部分：长会话、low 和 medium 推理强度、Dot 上的任何对照实验。

## 设计哲学

- 规则只留两类：系统提示已经写了但模型照犯的，和个人偏好。模型本来就会做的事不写。
- 写原则，不写案例。聪明的模型靠泛化；把出过的事故写进规则，事故本身会被模型在回复里复述。
- 文件内部不能互相矛盾，引用的章节必须存在。
- 换模型就重审一遍：新系统提示已经管住的删掉，新系统提示反向推动的留下。
- 能测就测。同一个小任务带规则和不带规则各跑几次，看方向。样本小的时候只看方向。
- 体积是成本。每条规则都在分走其它规则的注意力。
- 授权只能由用户写。写清范围、允许的动作、最坏结果，模型自己不能加也不能放宽。

## 证据标签

| 标签 | 含义 |
| --- | --- |
| 实测 | 有对照实验数据 |
| 在用 | 来自真实会话里反复出现的问题，没有做对照实验 |
| 推导 | 由系统提示或平台策略文本推出，没有实测 |
| 偏好 | 个人偏好，按自己的习惯改 |

## 目录

| 路径 | 内容 |
| --- | --- |
| [`fragments/`](fragments) | 片段库，唯一的源头。一个文件一个片段，文件头写适用系列、证据和依据 |
| [`presets/`](presets) | 四份全量预设，由片段生成 |
| [`skills/agents-composer/`](skills/agents-composer) | 提问、拼装、安装 AGENTS.md 的 skill |
| [`docs/`](docs) | 展示页（GitHub Pages） |
| [`tools/build.py`](tools/build.py) | 从片段生成预设、展示页数据和 skill 的片段目录 |
| [`research/`](research/README.md) | 迁移记录、各历史版本、Dot 的授权策略对照、DSH 上的实验 |
| [`experiments/codex-ab/`](experiments/codex-ab) | `codex exec` 对照实验的脚本、样例仓库、各组 AGENTS 和每次运行的结果 |

## 改片段

改 `fragments/` 下的文件，然后：

```sh
python tools/build.py          # 重新生成预设、展示页数据、skill 的片段目录
python tools/build.py --check  # 校验
```

`--check` 做三件事：生成物没有过期；默认片段拼起来与实验里用的原文件逐字节相同；展示页的拼装逻辑与 skill 的脚本对随机选择给出相同结果。片段格式见 [fragments/README.md](fragments/README.md)。

改了 `docs/` 下的脚本也要运行一次 `python tools/build.py`：它会更新 `index.html` 里脚本地址后面的内容哈希，浏览器才不会拿缓存的旧脚本去配新页面。

## License

[MIT](LICENSE)
