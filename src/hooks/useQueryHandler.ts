import { useCallback } from 'react';
import { ChatSession, View, ConversationMessage } from '../types';
import { processQuery } from '../services/mockAI';
import { generateId } from '../utils/id';

export function useQueryHandler(
  currentSession: ChatSession | undefined,
  currentView: View | undefined,
  currentSessionId: string,
  activeViewId: string,
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>
) {
  const handleSubmitQuery = useCallback((query: string) => {
    if (!currentSession || !currentView) return;

    const lastMessage = currentView.messages[currentView.messages.length - 1];
    const lastResponse = lastMessage?.response;

    const response = processQuery(query, lastResponse);

    const newMessage: ConversationMessage = {
      id: generateId(),
      userQuery: query,
      response,
      timestamp: new Date(),
    };

    const isFirstMessage = currentView.messages.length === 0;
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              ...(isFirstMessage && { name: query.slice(0, 50) + (query.length > 50 ? '...' : '') }),
              views: session.views.map((view) =>
                view.id === activeViewId
                  ? { ...view, messages: [...view.messages, newMessage] }
                  : view
              ),
              lastAccessed: new Date(),
            }
          : session
      )
    );
  }, [currentSession, currentView, currentSessionId, activeViewId, setSessions]);

  return { handleSubmitQuery };
}
