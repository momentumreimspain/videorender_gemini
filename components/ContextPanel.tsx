import React, { useState } from "react";

interface ContextPanelProps {
  description: string;
  tags: string[];
  onDescriptionChange: (desc: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  description,
  tags,
  onDescriptionChange,
  onTagsChange,
  onSave,
  isSaving
}) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onTagsChange([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="rounded-lg border bg-white dark:bg-slate-800 text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Context (guardado en BBDD)</h3>

      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Añade una descripción del proyecto..."
            className="w-full h-20 px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Tags
          </label>

          {/* Tag input */}
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Añadir tag..."
              className="flex-1 px-3 py-1.5 bg-background border border-input rounded text-sm text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm font-medium transition-colors shadow-sm"
            >
              +
            </button>
          </div>

          {/* Tag list */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 border border-primary text-primary rounded text-xs"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          {isSaving ? 'Guardando...' : 'Guardar en BBDD'}
        </button>
      </div>
    </div>
  );
};
