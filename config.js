export const config = {
	connectorName: 'AnthropicAI',
	models: [
		'claude-instant-1.2',
		'claude-2.0',
		'claude-2.1',
		'claude-3-opus-20240229',
		'claude-3-sonnet-20240229',
	],
	properties: [
		{ id: 'temperature', name: 'Temperature', value: 0.7, type: 'number' },
	],
	settings: [{ id: 'API_KEY', name: 'API Key', value: '', type: 'string' }],
	author: 'Prompt Mixer',
	description:
		"AnthropicAI connector runs Anthropic's safety-first language models",
	iconBase64:
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjE4MjUgMi45MjQ2MUg4Ljk3OTM5TDEyLjk5NjkgMTMuMDc1NUgxNS4yTDExLjE4MjUgMi45MjQ2MVpNNC44MTc1MiAyLjkyNDYxTDAuNzk5OTg4IDEzLjA3NTVIMy4wNDY1MUwzLjg2ODEgMTAuOTQzOEg4LjA3MTJMOC44OTI3OSAxMy4wNzU1SDExLjEzOTNMNy4xMjE3OCAyLjkyNDYxSDQuODE3NTJaTTQuNTk0ODQgOS4wNTg2TDUuOTY5NjUgNS40OTEyTDcuMzQ0NDYgOS4wNTg2SDQuNTk0ODRaIiBmaWxsPSIjNkY3MzdBIi8+Cjwvc3ZnPgo=\n',
};
