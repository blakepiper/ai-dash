import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Search, Command } from 'lucide-react';
import { PaletteAction } from '../hooks/useCommandPalette';

interface CommandPaletteProps {
  isOpen: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  actions: PaletteAction[];
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  search,
  onSearchChange,
  actions,
  onClose,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  const executeAction = useCallback((action: PaletteAction) => {
    onClose();
    action.handler();
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, actions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (actions[activeIndex]) {
          executeAction(actions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [actions, activeIndex, executeAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="command-palette-input-wrapper">
          <Search size={18} />
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Type a command..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <kbd className="command-palette-kbd">esc</kbd>
        </div>

        <div className="command-palette-list">
          {actions.length === 0 ? (
            <div className="command-palette-empty">No matching commands</div>
          ) : (
            actions.map((action, index) => (
              <button
                key={action.id}
                className={`command-palette-item ${index === activeIndex ? 'active' : ''}`}
                onClick={() => executeAction(action)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className="command-palette-item-label">{action.label}</span>
                <span className="command-palette-item-category">{action.category}</span>
                {action.shortcut && (
                  <kbd className="command-palette-shortcut">{action.shortcut}</kbd>
                )}
              </button>
            ))
          )}
        </div>

        <div className="command-palette-footer">
          <Command size={12} />
          <span>K to toggle</span>
          <span className="command-palette-footer-sep">|</span>
          <span>Arrow keys to navigate</span>
          <span className="command-palette-footer-sep">|</span>
          <span>Enter to select</span>
        </div>
      </div>
    </div>
  );
};
