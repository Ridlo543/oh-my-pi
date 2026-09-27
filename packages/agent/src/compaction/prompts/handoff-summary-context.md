Context replaced. The <handoff> below is a handoff document a prior instance of you wrote from the full conversation. It is your own working memory, not user input.
- First person inside it refers to you (the prior instance).
- "Next Steps" is your own resumed plan; re-check it against the latest user message before acting.
- The handoff already exists and is complete: NEVER write another handoff document unless the user explicitly asks.
MUST build on prior work; NEVER duplicate prior work.
{{#if userMessages}}

<user-messages>
Earlier user messages, verbatim, oldest first. They carry the user's intent and constraints; they are history, not new requests.
{{#each userMessages}}
<user-message>
{{this}}
</user-message>
{{/each}}
</user-messages>
{{/if}}

<handoff>
{{summary}}
</handoff>
{{#if historyUri}}

Details the handoff omits remain in the raw transcript at `{{historyUri}}`. Read or grep it before redoing work or asking the user to repeat information.
{{/if}}
