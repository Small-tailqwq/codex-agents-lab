# Assembling by hand

`scripts/compose.py` does all of this. Follow these steps only when Python is unavailable.

`assets/catalog.json` has `targets.<target>.fragments`, already in document order. Each fragment has:

| Key | Meaning |
| --- | --- |
| `id`, `scene`, `title`, `note`, `evidence` | Identity and what to tell the user |
| `series` | Series this text is for. Two entries may share an `id`; use the one that lists your series |
| `default` | Series where it is on unless the user says otherwise |
| `locale: zh` | Use only when the conversation language is Chinese |
| `requires` | Fragments that must be included with it |
| `with` | Not chosen directly. Include it when any listed fragment is included; `kind:grant` means any grant |
| `group`, `section` | Heading lines that precede the body |
| `body` | The text |
| `zh` | A Chinese rendering of `body`, line for line, for explaining a fragment to a Chinese-reading user. It never goes into the file |

Steps:

1. Keep the fragments whose `series` lists yours and whose `locale` fits the language.
2. Start from the chosen ones, add what they `require`, then add every `with` fragment whose condition holds. Repeat until nothing changes. A grant the user wrote is a fragment in the `## Grants` section after the catalog's grants, with the body `### <name>` followed by a blank line and one `- <Field>: <text>` line per non-empty field.
3. Emit in catalog order. Before a fragment, write its `group` line if it differs from the previous fragment's, then its `section` line if the group or section changed. Separate everything with one blank line, except two fragments in the same section where one ends and the next begins with a `- ` line: those join with a single newline.
4. In each body, replace `{{language}}` with the conversation language in English. Replace `{{when KEY|A|B}}` with `A` when KEY is the id of an included fragment, or is `zh` and the language is Chinese; otherwise with `B`, or nothing when there is no `B`. Delete a line that a `when` left empty.
5. End the file with one newline.
