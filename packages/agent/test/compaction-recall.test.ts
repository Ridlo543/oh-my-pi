import { describe, expect, it } from "bun:test";
import { type CompactionRecall, compact, createFileOps } from "@oh-my-pi/pi-agent-core/compaction";
import type { AgentMessage } from "@oh-my-pi/pi-agent-core/types";
import type { AssistantMessage, Context, Model, Usage } from "@oh-my-pi/pi-ai/types";

const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0 } as unknown as Usage;

// A non-Anthropic, non-OpenAI model keeps compact() on the local summarizer path.
const model = {
	id: "local-summarizer",
	provider: "custom",
	api: "openai-completions",
	baseUrl: "http://127.0.0.1:1",
	maxTokens: 8192,
	contextWindow: 200_000,
} as unknown as Model;

const TAIL_FAILURE = "error: expected 3 to equal 4 (math.test.ts:12)";
const messages = [
	{ role: "user", content: "run the tests", timestamp: 0 },
	{
		role: "assistant",
		content: [{ type: "toolCall", id: "call-1", name: "bash", arguments: { command: "bun test" } }],
		provider: "custom",
		model: "local-summarizer",
		api: "openai-completions",
		usage,
		stopReason: "toolUse",
		timestamp: 0,
	},
	{
		role: "toolResult",
		toolCallId: "call-1",
		toolName: "bash",
		content: [{ type: "text", text: `$ bun test\n${"x".repeat(5000)}\n${TAIL_FAILURE}` }],
		isError: false,
		timestamp: 0,
	},
] as unknown as AgentMessage[];

/** Runs compact() under `recall` and returns the full-summary request text the summarizer received. */
async function summarizerInput(recall: CompactionRecall | undefined): Promise<string> {
	const requests: string[] = [];
	await compact(
		{
			firstKeptEntryId: "kept",
			messagesToSummarize: messages,
			turnPrefixMessages: [],
			recentMessages: [],
			isSplitTurn: false,
			tokensBefore: 50_000,
			fileOps: createFileOps(),
			settings: { enabled: true, keepRecentTokens: 1000, recall },
		},
		model,
		"test-key",
		undefined,
		undefined,
		{
			completeImpl: (_model: Model, ctx: Context) => {
				const block = ctx.messages[0]?.content;
				requests.push(typeof block === "string" ? block : JSON.stringify(block));
				return Promise.resolve({
					role: "assistant",
					content: [{ type: "text", text: "## Goal\n- run tests" }],
					provider: "custom",
					model: "local-summarizer",
					usage,
					stopReason: "stop",
					timestamp: 0,
				} as unknown as AssistantMessage);
			},
		},
	);
	// The first request is the structured summary; later ones are the short UI summary.
	return requests[0] ?? "";
}

describe("compaction.recall", () => {
	it("anchored (default) keeps tool-output tails and asks for failed approaches; classic keeps the head only", async () => {
		const anchored = await summarizerInput(undefined);
		const classic = await summarizerInput("classic");

		// A failure at the end of a long tool output only survives anchored truncation.
		expect(anchored).toContain(TAIL_FAILURE);
		expect(classic).not.toContain(TAIL_FAILURE);
		expect(classic).toContain("more characters truncated]");
		// Only anchored asks the summarizer to carry rejected approaches forward.
		expect(anchored).toContain("## Failed Approaches");
		expect(classic).not.toContain("## Failed Approaches");
	});
});
