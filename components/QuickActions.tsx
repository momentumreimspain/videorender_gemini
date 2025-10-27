import React from "react";

interface QuickActionsProps {
  videoUrl: string;
  onDownload: () => void;
  onShare?: () => void;
  onRegenerate?: () => void;
  onNewVideo?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  videoUrl,
  onDownload,
  onShare,
  onRegenerate,
  onNewVideo
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        {/* Nuevo Video - Destacado */}
        {onNewVideo && (
          <button
            onClick={onNewVideo}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Video</span>
          </button>
        )}

        <button
          onClick={onDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Descargar</span>
        </button>

        {onShare && (
          <button
            onClick={onShare}
            className="flex items-center space-x-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Compartir</span>
          </button>
        )}

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center space-x-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Regenerar</span>
          </button>
        )}

        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = videoUrl;
            link.target = '_blank';
            link.click();
          }}
          className="flex items-center space-x-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Abrir en nueva pestaña</span>
        </button>
      </div>
    </div>
  );
};
