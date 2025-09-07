import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToolContext } from '@/hooks/useToolContext';
import { useToast } from '@/hooks/use-toast';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { handleToolSelect } = useToolContext();
  const { toast } = useToast();

  const showShortcutsHelp = useCallback(() => {
    toast({
      title: "Keyboard Shortcuts",
      description: (
        <div className="space-y-2 mt-2">
          <div><kbd>Cmd+K</kbd> - Command palette</div>
          <div><kbd>Ctrl+H</kbd> - Go to home</div>
          <div><kbd>Ctrl+Shift+H</kbd> - View history</div>
          <div><kbd>Ctrl+S</kbd> - Go to settings</div>
          <div><kbd>Ctrl+/</kbd> - Show shortcuts</div>
          <div><kbd>Ctrl+P</kbd> - Print results</div>
          <div><kbd>Ctrl+Shift+E</kbd> - Export results</div>
        </div>
      ),
      duration: 8000,
    });
  }, [toast]);

  const shortcuts: ShortcutConfig[] = [
    // Cmd+K is now handled by useCommandPalette hook
    {
      key: 'h',
      ctrl: true,
      description: 'Go to home',
      action: () => {
        handleToolSelect(null);
        router.push('/');
      },
    },
    {
      key: 'h',
      ctrl: true,
      shift: true,
      description: 'View history',
      action: () => {
        router.push('/history');
      },
    },
    {
      key: 's',
      ctrl: true,
      description: 'Go to settings',
      action: () => {
        router.push('/settings');
      },
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: showShortcutsHelp,
    },
    {
      key: 'p',
      ctrl: true,
      description: 'Print results',
      action: () => {
        const printButton = document.querySelector('button:has(svg.lucide-printer)') as HTMLButtonElement;
        if (printButton) {
          printButton.click();
        }
      },
    },
    {
      key: 'e',
      ctrl: true,
      shift: true,
      description: 'Export results',
      action: () => {
        const exportButton = document.querySelector('button:has(svg.lucide-download)') as HTMLButtonElement;
        if (exportButton) {
          exportButton.click();
        }
      },
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      shortcuts.forEach(shortcut => {
        const ctrlPressed = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
        const altPressed = shortcut.alt ? event.altKey : !event.altKey;
        const shiftPressed = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlPressed &&
          altPressed &&
          shiftPressed
        ) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return { showShortcutsHelp };
}