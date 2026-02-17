import React, { useEffect, useCallback, useMemo } from 'react';
import { PinnedChart } from './types';
import { Sidebar } from './components/Sidebar';
import { TabBar } from './components/TabBar';
import { ViewTab } from './components/ViewTab';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSessionManager } from './hooks/useSessionManager';
import { useViewManager } from './hooks/useViewManager';
import { useQueryHandler } from './hooks/useQueryHandler';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSetupState } from './hooks/useSetupState';
import { useCommandPalette, PaletteAction } from './hooks/useCommandPalette';
import { SetupWizard } from './components/SetupWizard';
import { CommandPalette } from './components/CommandPalette';
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
    handleAddDataset,
    handleImportSession,
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

  const { isDark, toggleDark } = useTheme();
  const { setupState, completeSetup, skipSetup } = useSetupState();

  // Command palette actions
  const paletteActions: PaletteAction[] = useMemo(() => [
    { id: 'new-session', label: 'New Session', shortcut: 'Cmd+N', category: 'Session', handler: () => handleNewSession(setActiveViewId) },
    { id: 'new-view', label: 'New View', shortcut: 'Cmd+T', category: 'View', handler: handleNewView },
    { id: 'toggle-theme', label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', category: 'Theme', handler: toggleDark },
    ...sessions.map((s, i) => ({
      id: `session-${s.id}`,
      label: `Switch to: ${s.name}`,
      category: 'Session',
      handler: () => handleSelectSession(s.id, setActiveViewId),
    })),
  ], [sessions, isDark, handleNewSession, setActiveViewId, handleNewView, toggleDark, handleSelectSession]);

  const { isOpen: paletteOpen, search: paletteSearch, setSearch: setPaletteSearch, toggle: togglePalette, close: closePalette, filteredActions } = useCommandPalette(paletteActions);

  // Keyboard shortcuts
  const newSessionShortcut = useCallback(
    () => handleNewSession(setActiveViewId),
    [handleNewSession, setActiveViewId]
  );

  useKeyboardShortcuts({
    onNewSession: newSessionShortcut,
    onNewView: handleNewView,
    onToggleCommandPalette: togglePalette,
  });

  const handlePinnedChartsChange = useCallback((viewId: string, pinnedCharts: PinnedChart[]) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              views: session.views.map((v) =>
                v.id === viewId ? { ...v, pinnedCharts } : v
              ),
            }
          : session
      )
    );
  }, [currentSessionId, setSessions]);

  // Initialize with a default session
  useEffect(() => {
    if (sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId, setCurrentSessionId]);

  if (!currentSession || !currentView) {
    return <div>Loading...</div>;
  }

  if (!setupState.isComplete) {
    return (
      <SetupWizard
        onComplete={completeSetup}
        onSkip={skipSetup}
        onDatasetUploaded={handleAddDataset}
      />
    );
  }

  return (
    <div className="app">
      <CommandPalette
        isOpen={paletteOpen}
        search={paletteSearch}
        onSearchChange={setPaletteSearch}
        actions={filteredActions}
        onClose={closePalette}
      />
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => handleSelectSession(id, setActiveViewId)}
        onNewSession={() => handleNewSession(setActiveViewId)}
        onRenameSession={handleRenameSession}
        onDeleteSession={(id) => handleDeleteSession(id, setActiveViewId)}
        onImportSession={handleImportSession}
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
            onDatasetUploaded={handleAddDataset}
            onPinnedChartsChange={handlePinnedChartsChange}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
