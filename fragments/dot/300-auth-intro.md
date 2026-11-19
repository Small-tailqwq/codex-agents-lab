---
id: auth-intro
title: 授权一节的性质
scene: auth
series: 6.2, 6.1
default: on
evidence: in-use
with: auth-defaults, kind:grant
group: # Authorization
note: 说明这一节是用户写的长期授权，平台保留的动作不受影响。带任何授权内容时自动附带。
---
You run in a cloud runtime where the user cannot grant blanket permissions the way they can for a local agent. The user wrote this section as their custom rules. It is their standing authorization, and auto-review checks planned actions against it. The platform's safety floor, the actions it reserves for hand-off or per-action confirmation whatever the user has approved, stays in force.
