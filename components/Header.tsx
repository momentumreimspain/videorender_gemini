import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Theme } from "../hooks/useTheme";

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
  return (
    <header className="border-b bg-white dark:bg-slate-800 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">Momentum AI RE</h1>
              <p className="text-xs text-muted-foreground">Generador de Videos con IA</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
};
