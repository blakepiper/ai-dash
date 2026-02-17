import { ChatSession, ConversationMessage } from '../types';

export function exportAsJSON(session: ChatSession): string {
  return JSON.stringify(session, null, 2);
}

function messageToMarkdown(msg: ConversationMessage): string {
  let md = `### Q: ${msg.userQuery}\n\n`;

  if (msg.response.text) {
    md += `${msg.response.text}\n\n`;
  }

  if (msg.response.chart) {
    md += `**Chart:** ${msg.response.chart.title} (${msg.response.chart.type} chart, ${msg.response.chart.data.length} data points)\n\n`;
  }

  md += `> **Insight:** ${msg.response.explanation}\n\n`;
  md += `---\n\n`;
  return md;
}

export function exportAsMarkdown(session: ChatSession): string {
  let md = `# ${session.name}\n\n`;
  md += `*Exported from AI Dash*\n\n`;

  for (const view of session.views) {
    if (view.messages.length === 0) continue;
    md += `## ${view.name}\n\n`;
    for (const msg of view.messages) {
      md += messageToMarkdown(msg);
    }
  }

  return md;
}

export function importFromJSON(json: string): ChatSession {
  const parsed = JSON.parse(json);

  // Rehydrate dates
  return {
    ...parsed,
    lastAccessed: new Date(parsed.lastAccessed),
    views: parsed.views.map((v: any) => ({
      ...v,
      createdAt: new Date(v.createdAt),
      messages: v.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
        response: {
          ...m.response,
          timestamp: new Date(m.response.timestamp),
        },
      })),
      pinnedCharts: (v.pinnedCharts || []).map((p: any) => ({
        ...p,
        pinnedAt: new Date(p.pinnedAt),
      })),
    })),
    datasets: (parsed.datasets || []).map((d: any) => ({
      ...d,
      uploadedAt: new Date(d.uploadedAt),
    })),
  };
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
