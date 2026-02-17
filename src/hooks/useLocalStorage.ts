import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatSession } from '../types';

const STORAGE_KEY = 'ai-dash-sessions';
const DEBOUNCE_MS = 500;

function serialize(sessions: ChatSession[]): string {
  return JSON.stringify(sessions);
}

function deserialize(json: string): ChatSession[] {
  const parsed = JSON.parse(json);
  return parsed.map((s: any) => ({
    ...s,
    lastAccessed: new Date(s.lastAccessed),
    views: s.views.map((v: any) => ({
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
    })),
  }));
}

export function loadSessions(): ChatSession[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return deserialize(stored);
    }
  } catch {
    // Corrupted data — ignore
  }
  return null;
}

export function usePersistSessions(sessions: ChatSession[]) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, serialize(sessions));
      } catch {
        // Storage full — silently fail
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sessions]);
}
