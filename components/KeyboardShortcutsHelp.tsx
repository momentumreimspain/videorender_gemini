import React, { useState } from "react";

const shortcuts = [
  { key: "⌘ + Enter", description: "Generar video" },
  { key: "⌘ + S", description: "Guardar proyecto" },
  { key: "⌘ + D", description: "Descargar video" },
  { key: "⌘ + Shift + G", description: "Mostrar/ocultar galería" },
];

export const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40 transition-all hover:scale-110"
        title="Atajos de teclado"
      >
        <span className="text-lg font-bold">?</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-lg shadow-2xl z-50 p-6 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Atajos de Teclado</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-muted text-foreground rounded text-xs font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Tip:</strong> Usa los presets rápidos de cámara para configurar automáticamente movimientos comunes.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
