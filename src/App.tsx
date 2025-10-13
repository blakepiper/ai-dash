import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TabBar } from './components/TabBar';
import { ViewTab } from './components/ViewTab';
import { ChatSession, View, ConversationMessage } from './types';
import { processQuery } from './services/mockAI';
import './App.css';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createHomeView = (): View => ({
  id: 'home',
  name: 'Home',
  messages: [],
  createdAt: new Date(),
});

const createNewView = (number: number): View => ({
  id: generateId(),
  name: `Analysis ${number}`,
  messages: [],
  createdAt: new Date(),
});

const createNewSession = (): ChatSession => ({
  id: generateId(),
  name: `Session ${new Date().toLocaleDateString()}`,
  views: [createHomeView()],
  lastAccessed: new Date(),
});

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [activeViewId, setActiveViewId] = useState<string>('home');

  // Initialize with a default session
  useEffect(() => {
    const initialSession = createNewSession();
    setSessions([initialSession]);
    setCurrentSessionId(initialSession.id);
  }, []);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentView = currentSession?.views.find((v) => v.id === activeViewId);

  const handleNewSession = () => {
    const newSession = createNewSession();
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveViewId('home');
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setActiveViewId(session.views[0]?.id || 'home');

      // Update last accessed
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, lastAccessed: new Date() } : s
        )
      );
    }
  };

  const handleNewView = () => {
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
  };

  const handleCloseView = (viewId: string) => {
    if (!currentSession || viewId === 'home') return;

    const updatedViews = currentSession.views.filter((v) => v.id !== viewId);

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, views: updatedViews }
          : session
      )
    );

    // Switch to home if closing active view
    if (viewId === activeViewId) {
      setActiveViewId('home');
    }
  };

  const handleSubmitQuery = (query: string) => {
    if (!currentSession || !currentView) return;

    // Get the last response for context (for iterations like "make it a bar chart")
    const lastMessage = currentView.messages[currentView.messages.length - 1];
    const lastResponse = lastMessage?.response;

    // Process the query through our mock AI
    const response = processQuery(query, lastResponse);

    // Create the conversation message
    const newMessage: ConversationMessage = {
      id: generateId(),
      userQuery: query,
      response,
      timestamp: new Date(),
    };

    // Update the session with the new message
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
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

    // Update session name if it's the first message
    if (currentView.messages.length === 0) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? { ...session, name: query.slice(0, 50) + (query.length > 50 ? '...' : '') }
            : session
        )
      );
    }
  };

  if (!currentSession || !currentView) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
      />

      <div className="main-content">
        <TabBar
          views={currentSession.views}
          activeViewId={activeViewId}
          onSelectView={setActiveViewId}
          onNewView={handleNewView}
          onCloseView={handleCloseView}
        />

        <ViewTab
          view={currentView}
          onSubmitQuery={handleSubmitQuery}
          isHome={currentView.name === 'Home'}
        />
      </div>
    </div>
  );
}

export default App;
