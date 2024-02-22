import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';

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
			TokenUsage: output.stats.inputTokens + output.stats.outputTokens, // Assuming total token usage is desired
		})),
		ModelType: outputs[0].stats.model,
	};
};

async function main(
	model: string,
	prompts: string[],
	properties: Record<string, unknown>,
	settings: Record<string, unknown>,
): Promise<ConnectorResponse> {
	const anthropic = new Anthropic({
		apiKey: settings?.[API_KEY] as string,
	});

	const messageHistory: Message[] = [];
	const outputs: ChatCompletion[] = [];

	try {
		for (const prompt of prompts) {
			messageHistory.push({ role: 'user', content: prompt });

			const response = (await anthropic.beta.messages.create({
				model: model,
				system: 'You are a helpful assistant.',
				max_tokens: 4096,
				messages: messageHistory,
				...properties,
			})) as AnthropicResponse;

			const assistantResponse = response.content
				.map((content) => content.text)
				.join('\n');
			const inputTokens = response.usage.input_tokens;
			const outputTokens = response.usage.output_tokens;

			messageHistory.push({ role: 'assistant', content: assistantResponse });

			outputs.push({
				output: assistantResponse,
				stats: { model, inputTokens, outputTokens },
			});

			console.log(`Response to prompt: ${prompt}`, assistantResponse);
		}

		return mapToResponse(outputs);
	} catch (error) {
		console.error('Error in main function:', error);
		throw error;
	}
}

export { main, config };
