import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';
import { sleep } from './utils';

const API_KEY = 'API_KEY';

interface Message {
	role: 'user' | 'assistant';
	content: string;
}

interface Completion {
	Content: string | null;
	TokenUsage: number | undefined;
}

interface ConnectorResponse {
	Completions: Completion[];
	ModelType: string;
}

interface ChatCompletion {
	output: string;
	stats: { model: string; inputTokens: number; outputTokens: number };
}

interface AnthropicResponse {
	content: { text: string; type: string }[];
	id: string;
	model: string;
	role: string;
	stop_reason: string;
	stop_sequence: string | null;
	type: string;
	usage: {
		input_tokens: number;
		output_tokens: number;
	};
}

const mapToResponse = (outputs: ChatCompletion[]): ConnectorResponse => {
	return {
		Completions: outputs.map((output) => ({
			Content: output.output,
			TokenUsage: output.stats.inputTokens + output.stats.outputTokens,
		})),
		ModelType: outputs[0].stats.model,
	};
};

async function main(
	model: string,
	prompts: string[],
	properties: Record<string, unknown>,
	settings: Record<string, unknown>,
) {
	const anthropic = new Anthropic({ apiKey: settings?.[API_KEY] as string });
	const messageHistory: Message[] = [];
	const outputs: ChatCompletion[] = [];

	try {
		for (const prompt of prompts) {
			messageHistory.push({ role: 'user', content: prompt });
			let retries = 3; // Maximum number of retries
			let response;
			do {
				try {
					response = (await anthropic.messages.create({
						model: model,
						system: 'You are a helpful assistant.',
						max_tokens: 4096,
						messages: messageHistory,
						...properties,
					})) as AnthropicResponse;

					// Process the successful response
					const assistantResponse = response.content
						.map((content) => content.text)
						.join('\n');
					const inputTokens = response.usage.input_tokens;
					const outputTokens = response.usage.output_tokens;
					messageHistory.push({
						role: 'assistant',
						content: assistantResponse,
					});
					outputs.push({
						output: assistantResponse,
						stats: { model, inputTokens, outputTokens },
					});
					console.log(`Response to prompt: ${prompt}`, assistantResponse);
					break; // Exit the loop on success
				} catch (error) {
					if (error.status === 429 && retries > 0) {
						// Rate limit error: Wait and retry
						console.warn('Rate limit exceeded, retrying...');
						await sleep(3000); // Wait for 3 seconds
						retries--;
					} else {
						// Other errors or retries exhausted
						console.error('Error:', error);
						throw error;
					}
				}
			} while (retries > 0);
		}
		return mapToResponse(outputs);
	} catch (error) {
		console.error('Error in main function:', error);
		throw error;
	}
}

export { main, config };
