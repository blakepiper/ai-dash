import { LLMProvider, LLMContext, LLMResponse } from '../llm';
import { LLMConfig } from '../index';

const SYSTEM_PROMPT = `You are an analytics AI assistant. Analyze data queries and respond with JSON matching this exact structure:
{
  "text": "Brief text summary of findings (optional)",
  "chartConfig": {
    "type": "line|bar|area|pie|funnel|scatter|kpi|stackedBar|table|treemap",
    "data": [{"key": "value", ...}],
    "xKey": "field name for x-axis",
    "yKey": "field name for y-axis (or array for multi-series)",
    "title": "Chart title"
  },
  "followUpSuggestions": ["suggestion 1", "suggestion 2"],
  "explanation": "Detailed insight about the data",
  "interpretation": {
    "intent": "What the user is asking",
    "entities": ["entity1", "entity2"],
    "dataSource": "Source of data",
    "assumptions": ["assumption1"]
  }
}
Only include chartConfig if a visualization is appropriate. Always include explanation and interpretation. Respond with ONLY the JSON object, no markdown.`;

export function createAnthropicProvider(config: LLMConfig): LLMProvider {
  const baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  const model = config.model || 'claude-sonnet-4-5-20250929';

  return {
    async sendQuery(query: string, context?: LLMContext): Promise<LLMResponse> {
      const messages: Array<{ role: string; content: string }> = [];

      if (context?.lastResponse) {
        messages.push({
          role: 'assistant',
          content: `Previous response context: ${context.lastResponse.explanation}`,
        });
      }

      messages.push({ role: 'user', content: query });

      const response = await fetch(`${baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${response.status} ${error}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;

      if (!content) {
        throw new Error('Empty response from Anthropic');
      }

      try {
        return JSON.parse(content) as LLMResponse;
      } catch {
        return {
          text: content,
          explanation: content,
          interpretation: {
            intent: 'General response',
            entities: [],
            dataSource: 'LLM',
            assumptions: ['Response was not structured JSON'],
          },
        };
      }
    },

    async testConnection(): Promise<boolean> {
      try {
        const response = await fetch(`${baseUrl}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey || '',
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model,
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }],
          }),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
  };
}
