import React, { useEffect, useState } from "react";
import { VideoProject } from "../services/firebaseService";

interface GallerySidebarProps {
  projects: VideoProject[];
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onSelectProject: (project: VideoProject) => void;
  onOpenModal: (project: VideoProject) => void;
  isLoading: boolean;
}

export const GallerySidebar: React.FC<GallerySidebarProps> = ({
  projects,
  isOpen,
  onClose,
  onToggle,
  onSelectProject,
  onOpenModal,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Get all unique tags from projects
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])));

  // Filter projects based on search and tag
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag = !filterTag || project.tags?.includes(filterTag);

    return matchesSearch && matchesTag;
  });
  // Keyboard shortcut: Cmd+Shift+G
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-20 z-40 p-3 bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg"
        title="Abrir galería (⌘⇧G)"
      >
        <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-800 border-l border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-foreground">Galería</h2>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted/50 rounded">
            ⌘⇧G
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded transition-colors"
        >
          <svg className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
        {/* Search and Filter */}
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilterTag(null)}
                className={`px-2 py-1 text-xs rounded ${!filterTag ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                Todos
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-2 py-1 text-xs rounded ${filterTag === tag ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">
              No hay proyectos aún
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-md transition-all duration-200"
              >
                {/* Video Preview */}
                <div
                  className="aspect-video bg-muted cursor-pointer relative"
                  onClick={() => onOpenModal(project)}
                >
                  <video
                    src={project.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />

                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      {project.description && (
                        <p className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                          {project.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {project.createdAt?.toDate().toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="ml-2 p-1.5 hover:bg-muted rounded transition-colors"
                      title="Cargar proyecto"
                    >
                      <svg className="w-4 h-4 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
