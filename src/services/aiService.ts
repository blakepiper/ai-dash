import { ResponseMessage, ChartType } from '../types';
import { getEffectiveConfig } from '../config';
import { LLMProvider, LLMContext, createProvider } from '../config/llm';
import { generateId } from '../utils/id';

// Re-export for backward compatibility
export { exampleQueries } from './mockAI';

let currentProvider: LLMProvider | null = null;

function getProvider(): LLMProvider {
  if (!currentProvider) {
    const config = getEffectiveConfig();
    currentProvider = createProvider(config.llm);
  }
  return currentProvider;
}

export function resetProvider(): void {
  currentProvider = null;
}

export async function processQueryAsync(
  query: string,
  lastResponse?: ResponseMessage
): Promise<ResponseMessage> {
  const provider = getProvider();
  const context: LLMContext = { lastResponse };

  const result = await provider.sendQuery(query, context);

  return {
    id: generateId(),
    type: result.chartConfig ? (result.text ? 'mixed' : 'chart') : 'text',
    chart: result.chartConfig
      ? {
          type: result.chartConfig.type as ChartType,
          data: result.chartConfig.data,
          xKey: result.chartConfig.xKey,
          yKey: result.chartConfig.yKey,
          title: result.chartConfig.title,
        }
      : undefined,
    text: result.text,
    explanation: result.explanation,
    interpretation: result.interpretation,
    followUpSuggestions: result.followUpSuggestions,
    timestamp: new Date(),
  };
}
