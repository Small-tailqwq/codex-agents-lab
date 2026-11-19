# Grants (Dot)

A grant is a scenario where the user has decided how much to trust Dot and how much loss they accept. Dot's auto-review checks planned actions against the grants, so a grant that is specific gets fewer actions blocked.

## Interview

Ask for one scenario at a time and fill five fields. The user decides every limit; you only tighten wording.

| Field | Ask |
| --- | --- |
| Scope | Where does this apply: which account, game, repository, site, recipient, or kind of task? |
| Granted | What may be done there without asking? |
| Why | Who owns what is at stake, and what is the worst outcome the user accepts? |
| Still ask | What inside this scope still needs approval each time? |
| Never | What must not be done there even if asked mid-task? |

- An action inside the scope that cannot be undone is named in Granted, and Why states the worst outcome. Review tends to treat "irreversible" as needing confirmation unless both are written down.
- Spending real money, creating or widening persistent access, and transmitting credentials go under Still ask unless the user says otherwise in so many words.
- `Still ask` and `Never` may be empty.

Write the answers to a JSON file for `compose.py --grants`:

```json
[{"name": "...", "scope": "...", "granted": "...", "why": "...", "still_ask": "...", "never": ""}]
```

The catalog's three `grant-*` fragments are the author's own scenarios. Use them as examples of the level of detail, not as defaults.

## What the platform honors

This comes from the `confirmation_policies` entries in the Codex model catalog. Whether Dot's runtime applies the same text per model has not been verified, so present it to the user as the best available reading.

| | gpt-6.1-terra, gpt-6.2-sol and earlier | gpt-6.2-astra |
| --- | --- | --- |
| Where pre-approval comes from | The user naming the action in the task request | The task request or the user's custom rules; a standing authorization spells out action, target, and limit |
| Text the model can edit itself | Not addressed | Background only, never authorization |
| Password changes | Handed to the user | Can be pre-approved |
| Verification codes, accepting terms, new or wider persistent access | Confirmed each time | Codes can have standing authorization; terms accepted as part of login or signup outside regulated industries need no confirmation |
| Transfers, permanent deletion, installing software of unknown origin | Hand-off or confirmation each time | Confirmation each time; custom rules cannot open these |

What follows for the user:

- On the older policy a grant makes the model and auto-review ask less, but the policy text recognizes only the task request. For an action that can be pre-approved, naming it in the task request is the most reliable.
- An action the policy confirms each time stays that way whatever a grant says. Leave it under Still ask.
- The user puts grants into Dot themselves. Text Dot adds under Authorization authorizes nothing.
