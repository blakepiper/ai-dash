import { ConversationMessage, DataStory, StorySection } from '../types';

export function generateStory(messages: ConversationMessage[], title?: string): DataStory {
  const sections: StorySection[] = [];

  sections.push({
    type: 'heading',
    content: title || 'Analytics Report',
  });

  sections.push({
    type: 'text',
    content: `This report summarizes ${messages.length} analytical queries and their findings.`,
  });

  for (const msg of messages) {
    sections.push({
      type: 'heading',
      content: msg.userQuery,
    });

    if (msg.response.chart) {
      sections.push({
        type: 'chart',
        content: msg.response.chart.title,
        chart: msg.response.chart,
      });
    }

    if (msg.response.text) {
      sections.push({
        type: 'text',
        content: msg.response.text,
      });
    }

    sections.push({
      type: 'insight',
      content: msg.response.explanation,
    });
  }

  return {
    title: title || 'Analytics Report',
    generatedAt: new Date(),
    sections,
  };
}
