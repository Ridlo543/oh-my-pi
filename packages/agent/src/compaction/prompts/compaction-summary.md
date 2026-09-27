You MUST summarize the conversation above into a structured handoff summary for another LLM to resume the task.

IMPORTANT: If the conversation ends with an unanswered question or a request awaiting user response (e.g., "Please run command and paste output"), you MUST preserve that exact question/request.

You MUST use this format (sections can be omitted if not applicable):

## Goal
[User goals; list multiple if session covers different tasks.]

## Constraints & Preferences
{{#if anchored}}
- [Every requirement, correction, and preference the user stated, including prohibitions; keep the user's wording for hard rules]
{{else}}
- [Constraints or requirements mentioned]
{{/if}}

## Progress

### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress]

## Key Decisions
- **[Decision]**: [Brief rationale]

{{#if anchored}}
## Failed Approaches
- **[Approach tried or option rejected]**: [Why it failed or who rejected it; the error or evidence]

{{/if}}
## Next Steps
1. [Ordered list of next actions]

## Critical Context
- [Important data, pending questions, references]

## Additional Notes
[Anything else important not covered above]

You MUST output only the structured summary; you NEVER include extra text.

Sections MUST be kept concise. You MUST preserve exact file paths, function names, error messages, and relevant tool outputs or command results. You MUST include repository state changes (branch, uncommitted changes) if mentioned.
{{#if anchored}}

You MUST record every failed attempt and rejected option under Failed Approaches so the next LLM does not repeat it. Next Steps MUST follow from the most recent user request; NEVER add work the user did not ask for.
{{/if}}
