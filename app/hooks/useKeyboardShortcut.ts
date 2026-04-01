"use client";

import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutOptions {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  preventDefault?: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcut(
  options: UseKeyboardShortcutOptions,
  callback: () => void
) {
  const { key, modifiers = [], preventDefault = true, enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const modifierMatch = modifiers.every(modifier => {
        switch (modifier) {
          case 'ctrl':
            return event.ctrlKey;
          case 'alt':
            return event.altKey;
          case 'shift':
            return event.shiftKey;
          case 'meta':
            return event.metaKey;
          default:
            return false;
        }
      });

      if (event.key.toLowerCase() === key.toLowerCase() && modifierMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    },
    [key, modifiers, preventDefault, enabled, callback]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}