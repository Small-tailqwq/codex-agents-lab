---
id: grant-github-bot
title: 示例：专用的 GitHub 机器人账号
scene: auth
series: 6.2, 6.1
default: off
evidence: in-use
kind: grant
group: # Authorization
section: ## Grants
note: 作者自用场景，账号名换成你自己的。新建令牌、安装应用、OAuth 授权仍需确认，与旧版确认策略一致。
---
### GitHub Bot Account

- Scope: GitHub tasks the user assigns, done through the bot account `Dot-Aemeath`, in the repositories and for the purpose the user named.
- Granted: signing in to the existing account session, forking, creating task branches, committing, pushing, opening PRs, and replying to review comments on those PRs. One task request covers all of these steps.
- Why: the user registered this account for your own use and accepts any loss to it.
- Still ask: creating or widening persistent access (new tokens, app installs, OAuth grants) and transmitting credentials; these go through the platform's per-instance confirmation or user takeover. Follow GitHub's terms, and don't act on repositories or publish beyond what the task named.
<!-- zh -->
### GitHub 机器人账号

- 范围：用户指派的 GitHub 任务，通过机器人账号 `Dot-Aemeath` 完成，限于用户点名的仓库和目的。
- 允许：登录已有的账号会话、fork、创建任务分支、提交、推送、开 PR，以及回复这些 PR 上的审查评论。一次任务请求覆盖以上所有步骤。
- 理由：这个账号是用户专门注册给你用的，它的任何损失用户都接受。
- 仍需询问：新建或扩大持久访问权限（新令牌、安装应用、OAuth 授权）和传输凭据；这些要走平台的逐次确认或由用户接手。遵守 GitHub 的条款，不要对任务点名之外的仓库动手，也不要发布任务之外的内容。
