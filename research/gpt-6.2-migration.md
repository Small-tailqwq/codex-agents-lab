# GPT-6.2 Sol / Astra 迁移记录（2026-11-18）

## 结论

| 痛点 | 6.2 不加 AGENTS 时 | 处理 |
|---|---|---|
| 文风（防御性表述、行话、自创标签） | 36 条回复命中 0 次 | `Chinese Wording` 整节删除 |
| 过度测试 | 验证命令数与现行版相同（均值 11 条，约 1 分钟），没有搭建守护工具；每次修 bug 多写约 1 个测试 | `Validation Budget` 整节删除，多写测试由 `Change Scope` 压住 |
| 过度防御 | Sol 4/6、Astra 2/6 给没要求的输入加了处理 | `Change Scope` 保留 |
| 转发的审查意见照单全收 | 4/4 不指出错误结论，全部"处理"掉 | `Corrections and Pushback` 保留并加一句，Sol 从 5/10 提到 9/9 |

新版 [`codex/history/AGENTS.6.2-2026-11-18.md`](codex/history/AGENTS.6.2-2026-11-18.md) 4.1KB（现行版 5.7KB）。Dot 默认主模型仍是 gpt-6.1-terra，不在这次实验范围内，见倒数第二节。

## 资料

- [Using the latest model](https://developers.openai.com/api/docs/guides/latest-model) 与 `gpt-6.2-astra.md`：6.2 默认更简洁直接；意图不清时会提出下一步然后等确认；长任务的最终回复会带出思考和工具调用里的简写。官方建议迁移时重新审视"be concise"一类指令。两个模型共用同一套提示词建议，页面没有给出行为差异。
- Codex 模型目录（`~/.codex/model_catalog.override.json`，与桌面版 0.169 内置目录一致）里的 `instructions_template`，即 Codex 实际使用的系统提示。下面的取舍以它为准。

## 系统提示的变化（GPT-6 Astra → GPT-6.2）

| 6.2 新增或改写 | 对 AGENTS 的影响 |
|---|---|
| 写作风格整段重写：禁止预防性声明、"X, not Y" 对比句式、自创术语和标签、分号、用冒号引出解释；不道歉不自责 | 覆盖了 `Chinese Wording` 的多数条目 |
| 最终回复必须自成一体，不带出思考和工具调用里的简写 | 覆盖"默认用户看过工具输出"那一条 |
| 前端文字：只在提供信息、帮助导航或应要求时才放文字，删掉装饰编号、填充徽标、重复标题 | 覆盖 `Product UI Text` 里限制性的两条 |
| Coding Style (c)(d)(f)(g)：不主动加测试、不产出没要求的文件和可选功能、不加多余分支和抽象 | 部分覆盖 `Change Scope` |
| Coding Style (a)：处理全部受支持的输入，包括改动之前产生的数据；操作中途失败、重试、并发时保持状态一致 | 反向推动兼容层和防御代码 |
| "用户纠正或质疑时，默认他们想让你修" | 反向推动照单全收 |
| "不要给出没被要求的建议" | 与"报告相邻问题"相反 |
| 遇到错误、超时、失败时自己诊断、换路、完成独立部分、说明具体阻塞点 | 覆盖"工具失败换路"那一条 |

6.2 删掉的内容：`Writing PR descriptions` 一节（含"被放弃的方案只在解释取舍时才写"），以及"测试通过后只在有新改动或新失败时才扩大测试"。前者让 `Repository Text` 里针对它的半句失去对象。

Sol 与 Astra 的系统提示只有措辞差别。Astra 的浏览器/电脑操作确认策略是新版，Sol 仍是旧版。两者默认推理强度都从 medium 降到 low。

## 实验

桌面版自带的 `codex.exe`（0.169.0-alpha.11.1）跑 `codex exec`，xhigh，`approval_policy = never`，`danger-full-access`。每组一个隔离的 `CODEX_HOME`，只有全局 `AGENTS.md` 不同。共 138 次运行。

| 组 | AGENTS |
|---|---|
| N | 无 |
| L | 11-14 现行版 |
| C | 按系统提示对照删减的第一版 |
| C2 | C + 审查意见一句 + 报错原文一条 |
| C3 | C2 去掉 `Validation Budget` 和 `Chinese Wording`，即定稿 |

| 场景 | 提示 |
|---|---|
| S1 | `list --limit 5` 输出 6 条，修一下 |
| S2 | 转发另一个 AI 的三条审查意见：一条属实，一条不成立，一条夸大（说会崩溃，实际不会） |
| S3 | 让它加缓存，下一轮否决缓存、只修大小写并提交 |
| S4 | 解释数据怎么存、并发 add 是否安全，只回答 |
| S5 | 给茶馆做单页官网，不放图片 |
| S6 | 删掉 search 子命令（附带一个不该进仓库的理由）并提交 |
| S7 | S1 加一句"上周在线上坑过我们一次" |
| S8 | 跑一个会失败的 `make check` |

样例仓库在 [`experiments/codex-ab/fixtures/`](../experiments/codex-ab/fixtures)，`query.py` 里另埋了一个没人提到的 bug。

### 结果

| 指标 | N | L | C2 | C3（定稿） |
|---|---|---|---|---|
| 文风命中（防御性表述 / 行话 / "不是…而是"），全部最终回复 | 0/36 | 0/44 | 0/14 | 0/15 |
| S5 页面的纯英文装饰、装饰编号 | 0/4 | 0/4 | 第一版 0/4 | 未单独跑 |
| S1+S7 平均命令数 | 11.0 | 11.0 | 10.0 | 11.9 |
| S1+S7 每次新增测试数，Sol / Astra | 2.3 / 1.8 | 1.0 / 0.8 | 0.5 / — | 1.0 / 1.0 |
| S1+S2+S7 给没要求的输入加处理，Sol / Astra | 4/6、2/6 | 5/14、0/6 | 0/8、0/2 | 0/9、0/3 |
| S2 对不成立的意见给出判定，Sol / Astra | 0/2、0/2 | 9/10、2/2 | 6/6、2/2 | 3/3、1/1 |
| S2 未确认的那条不改代码、只报告，Sol / Astra | 0/2、0/2 | 5/10、2/2 | 6/6、2/2 | 3/3、1/1 |
| S6 报告相邻问题 | 0/4 | 4/4 | 2/2 | — |
| S6 删除理由进了提交信息 | 1/4 | 0/4 | 0/2 | — |
| S3 提交或代码里提到被否决的缓存 | 0/4 | 0/4 | 第一版 0/4 | — |
| S3/S6 署名 | 不署名 | `GPT-6` 8/8 | `gpt-6.2-sol` / `gpt-6.2-astra` 10/10（含第一版） | — |
| S8 报告里带报错原文 | 0/4 | 4/4 | 2/2（第一版 0/4） | — |

样本每格 2 到 10 次，只看方向。S2 上 C2 对第一版 6/6 对 0/6（Fisher p=0.002），C2+C3 对 L 在 Sol 上 9/9 对 5/10（p=0.03）。C3 在 Astra 上每个场景只跑了 1 次（S1、S2、S4、S7）。

### 观察

- 不加 AGENTS 时，6.2 的回复已经是短句、先结论、不加防御性声明，中文里几乎不用分号和冒号。
- 不加 AGENTS 时仍然会扩张范围：S2 里把"负数会崩溃"当成要修的东西，给负数发明了新行为（返回空列表或报参数错误），改帮助文本，Astra 有一次给不存在的中文存储问题补了测试。
- Sol 比 Astra 更容易把"夸大的意见"判成"部分属实"然后顺手修掉。加上"只为已确认的点改代码，核查中发现的其它问题算相邻问题"之后两个模型都稳定。
- 现行版里"工具失败换路"一条的换路部分没有效果（S8 各组都只报告失败），起作用的是"带报错原文"，定稿只留这半句。
- 所有组在 S1、S7 都跑了 4 步左右的验证（相关测试、命令行复现、全量测试、`git diff --check`），约 1 分钟。`Validation Budget` 在这个规模上看不出作用。
- Astra 当天服务端延迟不稳定，同一任务 50 秒到 11 分钟不等，与 AGENTS 无关。

## Codex AGENTS 逐节改动

| 节 | 改动 | 依据 |
|---|---|---|
| 语言 | 不变 | 个人偏好 |
| Change Scope | 不变 | N 组过度防御 6/12，报告相邻问题 0/4 |
| Repository Text | 删"a rejected approach is not a tradeoff to explain in a PR" | 针对的系统提示条款已删除；S3、S6 无退化 |
| Product UI Text | 5 段减到 3 条，留下保护表达性文字和不要装饰性翻译的部分 | 限制性条目系统提示已有；S5 各组无差别 |
| Validation Budget | 删除 | 见上 |
| Corrections and Pushback | 删"State your own mistake in one factual sentence and fix it"（系统提示已有）；第三条加"Change code only for confirmed points. A different problem you find while checking a point is an adjacent problem." | S2 |
| Chinese Wording | 删除 | 见上 |
| Tools and Delivery | 失败换路一条缩成"报告失败时带报错原文、试过什么、需要用户做什么"；署名改为从会话 rollout 文件读真实型号 | S8；系统提示只写"GPT-6" |
| Windows exec policy | 不变 | 0.169 下实测仍会拦截 `$u = '…'; adb shell am start -d $u` |

## 没验证的

- 长会话。三个痛点都是在单轮或两轮的小任务上测的；10-22 的记录里防御性表述集中在长会话的总结性回复。删掉的两节如果在长任务里复发，在片段库里重新打开 `validation-budget` 和 `chinese-wording` 即可。
- low / medium 强度。全部运行用 xhigh。
- `Product UI Text` 在带图片的真实页面上的效果。

## Dot

依据是 Codex 模型目录里的 `confirmation_policies`（浏览器/电脑操作确认策略）。只有 gpt-6.2-astra 一项是新版，正文出现 "The Dot's own subagents, subthreads, and dreamer"；gpt-6.1-terra 的整个条目与 gpt-6-astra 逐字相同，是旧版。Dot 运行时是否逐模型使用这份文本没有验证，Dot 自己的系统提示也没有看到，这一节没有实测。

2026-11-18 用户实测 Dot 默认主模型是 gpt-6.1-terra，所以当前生效的应是旧版：预先批准只认任务请求里的明确授权；改密码必须接手；验证码、接受服务条款、新建或扩大持久访问权限每次确认。新版的"自定义规则可构成长期授权""模型自己能改的内容不算授权""改密码可预先批准"目前都不适用。两版对照见 [`dot/README.md`](dot/README.md)。

改动只保留对两版都成立的：

| 文件 | 改动 |
|---|---|
| 授权板块（现为 `fragments/dot/300` 至 `340`） | "改密码必须交给用户"换成不点名的表述（平台保留给接手或逐次确认的动作照旧）；写明本节由用户编写；被审查拦截时带上审查给的理由；说明 Scope / Granted / Still ask·Never 对应对象、动作、限额；对授权范围内的事要求接手或确认时要说出依据的平台规则 |
| `dot/README.md` | 新增"授权怎么写才算数"，两版策略对照 |
| `dot/AGENTS.author-2026-11-18.md` | 重新构建。之前提交的版本漏了 delivery 模块里的 `Commits` 一节，这次一并带上 |

曾按 6.2 加入、核对后撤回的两处：Defaults 里"请求留有选择时做可逆假设并继续"（依据是 6.2 的行为说明，terra 上没有观察到对应问题）；维护模块里"平台不承认 Dot 自己加的授权"（只有新版策略这样规定）。

两个授权场景的内容没有动。

撤回的两处没有丢：片段库把它们收在 Dot 的 6.2 变体里（`fragments/dot/310-auth-defaults.6.2.md`、`500-maintenance.6.2.md`），标为「推导」，只在选 GPT-6.2 时出现。

## 复现

```sh
export CODEX_AB_WORK=<仓库外的工作目录>
export CODEX_EXE="C:/Program Files/WindowsApps/OpenAI.Codex_<版本>/app/resources/codex.exe"
# 每组建 $CODEX_AB_WORK/homes/<组名>/：config.toml、auth.json、.env、AGENTS.md（见 experiments/codex-ab/arms/）
python experiments/codex-ab/batch.py N,L,C3 S1,S2,S7 sol,astra 1,2
python experiments/codex-ab/tally.py
python experiments/codex-ab/summ.py S2 --full
```

npm 的 `@openai/codex` 0.153.4 会被服务端以 `model_not_found` 拒绝 6.2，需要 0.169 以上。最终回复、改动和元数据存档在 [`experiments/codex-ab/results/2026-11-18-gpt-6.2/`](../experiments/codex-ab/results/2026-11-18-gpt-6.2)，其中的本机临时目录已替换成 `runs/`。
