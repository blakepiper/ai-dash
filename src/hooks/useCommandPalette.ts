import { useState, useCallback, useMemo } from 'react';

export interface PaletteAction {
  id: string;
  label: string;
  shortcut?: string;
  category: string;
  handler: () => void;
}

function fuzzyMatch(query: string, label: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const target = label.toLowerCase();
  return words.every((word) => target.includes(word));
}

export function useCommandPalette(actions: PaletteAction[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setSearch('');
      return !prev;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
  }, []);

  const filteredActions = useMemo(() => {
    if (!search.trim()) return actions;
    return actions.filter((a) => fuzzyMatch(search, a.label) || fuzzyMatch(search, a.category));
  }, [actions, search]);

  return {
    isOpen,
    search,
    setSearch,
    toggle,
    close,
    filteredActions,
  };
}
