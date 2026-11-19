---
name: agents-composer
description: Build or revise an AGENTS.md for Codex or Dot by asking the user a few multiple-choice questions and assembling tested rule fragments from this skill's catalog. Use when the user wants to set up, generate, slim down, or migrate their AGENTS.md or custom instructions (for example after moving to GPT-6.2), or to draft an authorization grant for Dot.
metadata:
  short-description: Compose AGENTS.md from tested fragments
---

# AGENTS Composer

`assets/catalog.json` holds rule fragments for Codex and Dot. Where GPT-6.2 and GPT-6.1 / GPT-6 need different wording, a fragment has one form for each. Every fragment carries an evidence label and a note on what it fixed. Find out which fragments this user needs, assemble the file, and install it once they approve.

A short file works better than a complete one, because every rule takes attention from the others. A fragment goes in when the user's situation calls for it, and the user is told what was left out and why.

Talk to the user in their language. Catalog titles and notes are in Chinese; translate them when the user reads another language.

## 1. Target and series

- Target is `codex` or `dot`. Usually it is you; ask when the user may be configuring a different agent. For Codex this skill writes the global file, `$CODEX_HOME/AGENTS.md`. A project's own AGENTS.md is outside its scope, so the choice between the two is not a question to put to the user.
- Series is `6.2` for gpt-6.2 models (Sol, Astra) and `6.1` for gpt-6.1 and gpt-6 models (Terra, GPT-6 Astra). Take the model from what the session establishes. In Codex that is the last `"model"` value in the session's rollout file, `$CODEX_HOME/sessions/**/rollout-*-$CODEX_THREAD_ID.jsonl`; a model name in the system prompt or a configured default is not proof. Ask when the session does not settle it. For a model newer than 6.2, use `6.2` and tell the user the fragments were not tested on it.

## 2. What already exists

Read the current file when there is one: `$CODEX_HOME/AGENTS.md` (default `~/.codex/AGENTS.md`) for Codex's global rules, or the instruction text the user gives you for Dot. Rules in it that the catalog does not have are the user's own. Keep them unless the user says otherwise, and review them in step 5.

## 3. Ask

List what is available:

```
python scripts/compose.py list --target <target> --series <series> --lang "<language>"
```

The output groups fragments by scene and marks each `on` (default for this series), `off` (available, not default), or `auto` (comes with other fragments). `--json` gives the same data for parsing.

Ask in one round, as choices the user can answer in a few characters. Use a structured question tool when you have one, otherwise a numbered list. Then end your turn. The draft is built from the user's answers, so nothing is assembled until they have answered. A question tool that returns before the user replies has given you no answer.

- The conversation language, unless the conversation already makes it plain.
- Which scenes describe how they use the agent, as a multi-select. Word each scene as something the user does, drawn from its fragments and notes.
- For Dot, whether there is anything they want done without being asked each time. Each answer becomes a grant: follow `references/grants.md`.

Scenes are the question. Leave single fragments out of it unless what the user said matches the note of a fragment that is `off` for this series; then ask about that one.

## 4. Assemble

```
python scripts/compose.py build --target <target> --series <series> --lang "<language>" \
  --scenes <ids> [--on <ids>] [--off <ids>] [--grants grants.json] -o <draft path>
```

`--lang` takes the language's English name, such as `"Simplified Chinese"`, because it is inserted into an English sentence. `--scenes` takes the scene ids the user chose, plus `base` for the language paragraph. `--on` and `--off` adjust single fragments. `--grants` is a JSON list of `{name, scope, granted, why, still_ask, never}`. The script adds fragments that the chosen ones depend on and prints the ids it used.

Without Python, assemble by hand from `assets/catalog.json` following `references/catalog.md`.

## 5. Rules outside the catalog

The user's own existing rules, and anything they ask for that the catalog lacks, are held to `references/philosophy.md` before they go into the draft. Put each in the section it belongs to. For each one, tell the user in a line whether you kept it and which of the two reasons in `philosophy.md` it meets, or why you suggest dropping it.

A fragment's wording is what was tested. Change it only when the user asks, and tell them the changed text is no longer the tested one.

## 6. Show, then install

Put the full draft in your reply, and for an existing file the diff as well. The user approves what they can read in the conversation, so a link to a file on disk is not enough. Add a short report: the draft's size in bytes next to the size of the file it replaces, one line per included scene, what was left out and why, which included fragments are labeled `derived` (reasoned from the system prompt or platform policy, never tested), and which of the user's own rules were kept or dropped.

Install after the user approves. What you install is the script's output plus the user's own rules from step 5. If anything else differs, line endings included, say so. Delete any draft file you wrote once it is installed or declined.

- Codex: copy the existing file to a dated backup beside it, then write the new one. It applies to new sessions.
- Dot: give the user the full text to put in themselves. Authorization counts only when the user wrote it, so a grant is never installed or widened by you.
