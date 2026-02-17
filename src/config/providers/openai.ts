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
Only include chartConfig if a visualization is appropriate. Always include explanation and interpretation.`;

function buildMessages(query: string, context?: LLMContext) {
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  if (context?.lastResponse) {
    messages.push({
      role: 'assistant',
      content: `Previous response context: ${context.lastResponse.explanation}`,
    });
  }

  messages.push({ role: 'user', content: query });
  return messages;
}

export function createOpenAIProvider(config: LLMConfig): LLMProvider {
  const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  const model = config.model || 'gpt-4o-mini';

  return {
    async sendQuery(query: string, context?: LLMContext): Promise<LLMResponse> {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: buildMessages(query, context),
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${error}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from OpenAI');
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
        const response = await fetch(`${baseUrl}/models`, {
          headers: { Authorization: `Bearer ${config.apiKey}` },
        });
        return response.ok;
      } catch {
        return false;
      }
    },
  };
}
