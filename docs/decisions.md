# Decision Record

## DEC-001: Track Project Memory in Markdown

Status: Accepted

Date: 2026-06-01

Decision: Maintain project progress, decisions, and useful conversation context
in Markdown files inside the repository.

Rationale: The project will be built in stages, and the user wants enough
durable context in GitHub to resume from any machine or session.

Implications:

- Future changes should update the relevant Markdown memory files.
- The docs should capture durable context and decisions, not every line of chat.

## DEC-002: Commit and Push After Material Changes

Status: Accepted

Date: 2026-06-01

Decision: After each material project change, commit the work and push it to the
GitHub remote.

Rationale: Keeping GitHub current ensures the project can be picked up from
another environment without relying on local-only state.

Implications:

- Commits should be focused and named clearly.
- If a change affects project direction or implementation assumptions, update
  the Markdown memory files before committing.
