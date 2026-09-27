import { describe, expect, it } from "bun:test";
import { serializeConversation } from "@oh-my-pi/pi-agent-core/compaction/utils";
import type { Message } from "@oh-my-pi/pi-ai";

describe("serializeConversation", () => {
	it("keeps the head and tail of long tool results so trailing failures reach the summarizer", () => {
		const longContent = `$ bun test\n${"x".repeat(5000)}\nerror: expected 3 to equal 4 (math.test.ts:12)`;
		const messages: Message[] = [
			{
				role: "toolResult",
				toolCallId: "tc1",
				toolName: "bash",
				content: [{ type: "text", text: longContent }],
				isError: false,
				timestamp: Date.now(),
			},
		];

		const result = serializeConversation(messages);

		expect(result).toContain("[Tool Result]: $ bun test");
		expect(result).toContain("error: expected 3 to equal 4 (math.test.ts:12)");
		expect(result).toContain(`[…${longContent.length - 2000}ch elided…]`);
		expect(result).not.toContain("x".repeat(3000));
	});

	it("does not truncate short tool results", () => {
		const shortContent = "x".repeat(1500);
		const messages: Message[] = [
			{
				role: "toolResult",
				toolCallId: "tc1",
				toolName: "read",
				content: [{ type: "text", text: shortContent }],
				isError: false,
				timestamp: Date.now(),
			},
		];

		const result = serializeConversation(messages);

		expect(result).toBe(`[Tool Result]: ${shortContent}`);
		expect(result).not.toContain("truncated");
	});

	it("does not truncate assistant or user messages", () => {
		const longText = "y".repeat(5000);
		const messages: Message[] = [
			{
				role: "user",
				content: [{ type: "text", text: longText }],
				timestamp: Date.now(),
			},
			{
				role: "assistant",
				content: [{ type: "text", text: longText }],
				api: "anthropic",
				provider: "anthropic",
				model: "test",
				usage: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					totalTokens: 0,
					cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
				},
				stopReason: "stop",
				timestamp: Date.now(),
			},
		];

		const result = serializeConversation(messages);

		expect(result).not.toContain("truncated");
		expect(result).toContain(longText);
	});
});
