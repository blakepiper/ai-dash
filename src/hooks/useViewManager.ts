import { useState, useCallback } from 'react';
import { ChatSession, ConversationMessage } from '../types';
import { generateId } from '../utils/id';

const createNewView = (number: number) => ({
  id: generateId(),
  name: `Analysis ${number}`,
  messages: [] as ConversationMessage[],
  createdAt: new Date(),
});

export function useViewManager(
  currentSession: ChatSession | undefined,
  currentSessionId: string,
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>
) {
  const [activeViewId, setActiveViewId] = useState<string>('home');

  const currentView = currentSession?.views.find((v) => v.id === activeViewId);

  const handleNewView = useCallback(() => {
    if (!currentSession) return;

    const viewNumber = currentSession.views.length;
    const newView = createNewView(viewNumber);

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, views: [...session.views, newView] }
          : session
      )
    );

    setActiveViewId(newView.id);
  }, [currentSession, currentSessionId, setSessions]);

  const handleCloseView = useCallback((viewId: string) => {
    if (!currentSession || viewId === 'home') return;

    const updatedViews = currentSession.views.filter((v) => v.id !== viewId);

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, views: updatedViews }
          : session
      )
    );

    if (viewId === activeViewId) {
      setActiveViewId('home');
    }
  }, [currentSession, currentSessionId, activeViewId, setSessions]);

  return {
    activeViewId,
    setActiveViewId,
    currentView,
    handleNewView,
    handleCloseView,
  };
}
