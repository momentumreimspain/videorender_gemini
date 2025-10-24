import React from "react";
import { CameraMovement, MovementSpeed, Duration } from "../types";

interface CameraPreset {
  name: string;
  icon: string;
  movement: CameraMovement;
  speed: MovementSpeed;
  duration: Duration;
  intensity: number;
  description: string;
}

const presets: CameraPreset[] = [
  {
    name: "Cinematic Zoom",
    icon: "🎬",
    movement: "zoom-in",
    speed: "slow",
    duration: "6s",
    intensity: 7,
    description: "Zoom in lento y cinematográfico"
  },
  {
    name: "Orbital View",
    icon: "🌍",
    movement: "orbit",
    speed: "medium",
    duration: "6s",
    intensity: 6,
    description: "Órbita suave alrededor del sujeto"
  },
  {
    name: "Dynamic Pan",
    icon: "↔️",
    movement: "pan-right",
    speed: "medium",
    duration: "4s",
    intensity: 5,
    description: "Paneo dinámico hacia la derecha"
  },
  {
    name: "Drone Rise",
    icon: "🚁",
    movement: "crane",
    speed: "slow",
    duration: "8s",
    intensity: 8,
    description: "Movimiento de grúa estilo drone"
  },
  {
    name: "Static Frame",
    icon: "📸",
    movement: "static",
    speed: "slow",
    duration: "6s",
    intensity: 1,
    description: "Sin movimiento, encuadre fijo"
  }
];

interface CameraPresetsProps {
  onSelectPreset: (preset: CameraPreset) => void;
}

export const CameraPresets: React.FC<CameraPresetsProps> = ({ onSelectPreset }) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">Presets Rápidos</Label>
      <div className="grid grid-cols-5 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelectPreset(preset)}
            className="flex flex-col items-center justify-center p-2 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            title={preset.description}
          >
            <span className="text-2xl mb-1">{preset.icon}</span>
            <span className="text-xs text-muted-foreground group-hover:text-primary font-medium text-center leading-tight">
              {preset.name.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word}
                  {i < preset.name.split(' ').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Export Label for use in this component
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <label className={className}>{children}</label>
);
