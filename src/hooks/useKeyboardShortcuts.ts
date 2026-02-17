import { useEffect } from 'react';

interface ShortcutHandlers {
  onNewSession: () => void;
  onNewView: () => void;
  onToggleCommandPalette?: () => void;
}

export function useKeyboardShortcuts({ onNewSession, onNewView, onToggleCommandPalette }: ShortcutHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      switch (e.key) {
        case 'n':
          e.preventDefault();
          onNewSession();
          break;
        case 't':
          e.preventDefault();
          onNewView();
          break;
        case 'k':
          e.preventDefault();
          onToggleCommandPalette?.();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNewSession, onNewView, onToggleCommandPalette]);
}
