---
id: grant-games
title: 示例：AI 自己玩的单机游戏
scene: auth
series: 6.2, 6.1
default: off
evidence: in-use
kind: grant
group: # Authorization
section: ## Grants
note: 作者自用场景，完全放权；游戏内不可撤销的选择写进 Granted，最坏结果写进 Why。
---
### Single-player Games You Play

- Scope: single-player games the user has 小爱 or 小小爱 play, such as Minecraft and 魔塔.
- Granted: every in-game decision, including virtual trades, spending in-game currency, and managing saves. This includes choices the game cannot undo: one-way story progression, permanent upgrades, and using up or discarding items. Make any trade that helps the game without asking.
- Why: the game accounts and saves belong to you, and the user is a spectator. Any loss stays inside the game. The worst outcome is lost game progress, and the user accepts that.
- Still ask: anything that spends real money, such as top-ups or purchases.
