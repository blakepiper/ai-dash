import { useState } from 'react';
import { ChatSession, View } from '../types';
import { generateId } from '../utils/id';
import { loadSessions, usePersistSessions } from './useLocalStorage';

const createHomeView = (): View => ({
  id: 'home',
  name: 'Home',
  messages: [],
  createdAt: new Date(),
});

export const createNewSession = (): ChatSession => ({
  id: generateId(),
  name: `Session ${new Date().toLocaleDateString()}`,
  views: [createHomeView()],
  lastAccessed: new Date(),
});

export function useSessionManager() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const stored = loadSessions();
    return stored && stored.length > 0 ? stored : [createNewSession()];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  // Persist sessions to localStorage with debounce
  usePersistSessions(sessions);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const handleNewSession = (setActiveViewId: (id: string) => void) => {
    const newSession = createNewSession();
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveViewId('home');
  };

  const handleSelectSession = (sessionId: string, setActiveViewId: (id: string) => void) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setActiveViewId(session.views[0]?.id || 'home');
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, lastAccessed: new Date() } : s
        )
      );
    }
  };

  const handleRenameSession = (sessionId: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, name: trimmed } : s))
    );
  };

  const handleDeleteSession = (sessionId: string, setActiveViewId: (id: string) => void) => {
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);

    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSessionId(updatedSessions[0].id);
        setActiveViewId(updatedSessions[0].views[0]?.id || 'home');
      } else {
        const newSession = createNewSession();
        setSessions([newSession]);
        setCurrentSessionId(newSession.id);
        setActiveViewId('home');
        return;
      }
    }

    setSessions(updatedSessions);
  };

  return {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    currentSession,
    handleNewSession,
    handleSelectSession,
    handleRenameSession,
    handleDeleteSession,
  };
}
