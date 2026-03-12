import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const shortcuts = [
    { key: 'Space', description: 'Play/Pause video' },
    { key: '←/→', description: 'Skip backward/forward 5s' },
    { key: 'J/L', description: 'Skip backward/forward 10s' },
    { key: '0-9', description: 'Jump to 0%-90% of video' },
    { key: 'M', description: 'Mute/Unmute' },
    { key: 'F', description: 'Toggle fullscreen' },
    { key: 'B', description: 'Toggle bounding boxes' },
    { key: '+/-', description: 'Zoom in/out timeline' },
    { key: 'R', description: 'Toggle review mode' },
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'Esc', description: 'Close dialogs' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-4 h-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-sm text-gray-900">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-1 max-h-80 overflow-y-auto">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                    <kbd className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                  Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500">?</kbd> anytime to view shortcuts
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
