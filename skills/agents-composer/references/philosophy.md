# What makes a rule worth its place

Use this to judge a rule the user already has, and to write one the catalog lacks.

## Two reasons to exist

A rule belongs in AGENTS.md for one of two reasons.

1. The model still does the unwanted thing although its system prompt covers it, or because its system prompt pushes the other way. The catalog's `tested` and `in-use` fragments are of this kind.
2. It is the user's personal preference: a language, a trailer format, a taste in UI copy.

A rule that restates what the model already does adds length and nothing else. When a user's rule looks like that, say so and suggest dropping it, with the reason.

## Writing one

- State the behavior wanted and when it applies. Capable models generalize from a principle, so a principle covers cases a list of cases would miss.
- Leave out the incident that led to the rule. A concrete story of what went wrong gets repeated back in later answers.
- Give the reason when it changes how the rule should be applied at the edges. One clause is enough.
- Quote a phrase only when the rule is about that phrase.
- One rule, one place. Put it in the section whose subject it shares and match the style of its neighbors.

## Checking the whole file

- Rules must not contradict each other. Read a new rule against every existing one, including rules that pull in opposite directions on the same situation.
- A reference to another section must point at a section that is in the file.
- Authorization is the user's to set. See `grants.md`.

## When the model changes

A new model series comes with a new system prompt, so every rule is re-examined against it.

- Drop a rule the new system prompt states and the model now follows without it.
- Keep a rule the new system prompt pushes against.
- Reword a rule whose target in the system prompt is gone.

When the user can spare a few runs, compare the same small task with and without the rule and look at the direction of the difference. A handful of runs shows direction, not size. Tell the user which conclusions rest on such a comparison and which do not.
