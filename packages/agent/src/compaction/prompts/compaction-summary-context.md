Prior model work/tool state available.
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

<summary>
{{summary}}
</summary>
{{#if historyUri}}

Details the summary omits remain in the raw transcript at `{{historyUri}}`. Read or grep it before redoing work or asking the user to repeat information.
{{/if}}
