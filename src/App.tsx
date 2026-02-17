import React, { useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TabBar } from './components/TabBar';
import { ViewTab } from './components/ViewTab';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSessionManager } from './hooks/useSessionManager';
import { useViewManager } from './hooks/useViewManager';
import { useQueryHandler } from './hooks/useQueryHandler';
import { useDarkMode } from './hooks/useDarkMode';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Moon, Sun } from 'lucide-react';
import './App.css';

function App() {
  const {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    currentSession,
    handleNewSession,
    handleSelectSession,
    handleRenameSession,
    handleDeleteSession,
  } = useSessionManager();

  const {
    activeViewId,
    setActiveViewId,
    currentView,
    handleNewView,
    handleCloseView,
  } = useViewManager(currentSession, currentSessionId, setSessions);

  const { handleSubmitQuery } = useQueryHandler(
    currentSession,
    currentView,
    currentSessionId,
    activeViewId,
    setSessions
  );

  const { isDark, toggleDark } = useDarkMode();

  // Keyboard shortcuts
  const newSessionShortcut = useCallback(
    () => handleNewSession(setActiveViewId),
    [handleNewSession, setActiveViewId]
  );

  useKeyboardShortcuts({
    onNewSession: newSessionShortcut,
    onNewView: handleNewView,
  });

  // Initialize with a default session
  useEffect(() => {
    if (sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId, setCurrentSessionId]);

  if (!currentSession || !currentView) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => handleSelectSession(id, setActiveViewId)}
        onNewSession={() => handleNewSession(setActiveViewId)}
        onRenameSession={handleRenameSession}
        onDeleteSession={(id) => handleDeleteSession(id, setActiveViewId)}
      />

      <div className="main-content">
        <TabBar
          views={currentSession.views}
          activeViewId={activeViewId}
          onSelectView={setActiveViewId}
          onNewView={handleNewView}
          onCloseView={handleCloseView}
        />

        <button
          className="theme-toggle"
          onClick={toggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <ErrorBoundary>
          <ViewTab
            view={currentView}
            onSubmitQuery={handleSubmitQuery}
            isHome={currentView.name === 'Home'}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
