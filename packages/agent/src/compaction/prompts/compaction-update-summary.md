Update existing handoff summary in <previous-summary> tags from new messages above for another LLM to resume.

MUST:
- preserve all previous-summary information; add new progress, decisions, context.
- Progress: move completed "In Progress" items to "Done".
{{#if anchored}}
- update "Next Steps" for completed work; Next Steps follow from the most recent user request.
{{else}}
- update "Next Steps" for completed work.
{{/if}}
- preserve exact file paths, function names, error messages.
{{#if anchored}}
- MAY remove irrelevant content, except Constraints & Preferences and Failed Approaches entries.
- keep every Constraints & Preferences and Failed Approaches entry unless the user explicitly reversed it; add new ones.
- record new failed attempts and rejected options in Failed Approaches.
{{else}}
- MAY remove irrelevant content.
{{/if}}
- If new messages end with an unanswered user question/request: add it to Critical Context; replace any previous pending question if answered.
- output only the structured summary; NEVER extra text.
- keep sections concise.
- preserve relevant tool outputs/command results.
- include mentioned repository state changes (branch, uncommitted changes).

Format (omit inapplicable sections):

## Goal
[Preserve existing goals; add new ones if task expanded]

## Constraints & Preferences
{{#if anchored}}
- [Preserve existing; add every new requirement, correction, and preference the user stated; keep the user's wording for hard rules]
{{else}}
- [Preserve existing; add new ones discovered]
{{/if}}

## Progress

### Done
- [x] [Include previously done and newly completed items]

### In Progress
- [ ] [Current work—update based on progress]

### Blocked
- [Current blockers—remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)
{{#if anchored}}

## Failed Approaches
- **[Approach tried or option rejected]**: [Why it failed or who rejected it] (preserve all previous, add new)
{{/if}}

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context; add new if needed]

## Additional Notes
[Other important info not fitting above]
