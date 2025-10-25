import React, { useEffect } from "react";
import { VideoProject } from "../services/firebaseService";
import { VideoPlayer } from "./VideoPlayer";

interface VideoModalProps {
  project: VideoProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const movementLabels: Record<string, string> = {
  'static': 'Estático',
  'pan-left': 'Paneo Izquierda',
  'pan-right': 'Paneo Derecha',
  'tilt-up': 'Inclinación Arriba',
  'tilt-down': 'Inclinación Abajo',
  'zoom-in': 'Zoom In',
  'zoom-out': 'Zoom Out',
  'dolly-in': 'Dolly In',
  'dolly-out': 'Dolly Out',
  'orbit': 'Órbita',
  'crane': 'Grúa'
};

export const VideoModal: React.FC<VideoModalProps> = ({ project, isOpen, onClose }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = project.videoUrl;
    link.download = `video_${project.id || Date.now()}.mp4`;
    link.click();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-card border border-border rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center space-x-3">
              {project.userPhoto && (
                <img
                  src={project.userPhoto}
                  alt={project.userName}
                  className="w-8 h-8 rounded-full border-2 border-border"
                />
              )}
              <div>
                <h3 className="font-semibold text-foreground">{project.userName || 'Usuario'}</h3>
                <p className="text-xs text-muted-foreground">
                  {project.createdAt?.toDate().toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Video Player */}
          <div className="p-6">
            <div className="bg-muted rounded-lg overflow-hidden mb-4">
              <VideoPlayer src={project.videoUrl} musicUrl="" />
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Left column */}
              <div className="space-y-3">
                {project.description && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Descripción</p>
                    <p className="text-sm text-foreground">{project.description}</p>
                  </div>
                )}

                {project.prompt && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Prompt</p>
                    <p className="text-sm text-foreground">{project.prompt}</p>
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 border border-primary text-primary rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - Technical details */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Configuración Técnica</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {project.cameraMovement && (
                    <div>
                      <span className="text-muted-foreground">Movimiento:</span>
                      <span className="ml-1 text-foreground font-medium">
                        {movementLabels[project.cameraMovement] || project.cameraMovement}
                      </span>
                    </div>
                  )}

                  {project.movementSpeed && (
                    <div>
                      <span className="text-muted-foreground">Velocidad:</span>
                      <span className="ml-1 text-foreground font-medium capitalize">{project.movementSpeed}</span>
                    </div>
                  )}

                  {project.duration && (
                    <div>
                      <span className="text-muted-foreground">Duración:</span>
                      <span className="ml-1 text-foreground font-medium">{project.duration}</span>
                    </div>
                  )}

                  {project.intensity && (
                    <div>
                      <span className="text-muted-foreground">Intensidad:</span>
                      <span className="ml-1 text-foreground font-medium">{project.intensity}/10</span>
                    </div>
                  )}

                  <div>
                    <span className="text-muted-foreground">Resolución:</span>
                    <span className="ml-1 text-foreground font-medium">{project.resolution}</span>
                  </div>

                  {project.musicTrack && project.musicTrack !== 'Ninguna' && (
                    <div>
                      <span className="text-muted-foreground">Música:</span>
                      <span className="ml-1 text-foreground font-medium">{project.musicTrack}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t border-border">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Descargar</span>
              </button>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = project.videoUrl;
                  link.target = '_blank';
                  link.click();
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-input bg-background hover:bg-accent rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Abrir en nueva pestaña</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
