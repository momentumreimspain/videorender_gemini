import React, { useState, useCallback, useEffect } from "react";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { generateVideoFromImage } from "./services/geminiService";
import {
  signInWithGoogle,
  logOut,
  onAuthChange,
  saveVideoProject,
  getAllProjects,
  deleteVideoProject,
  uploadFile,
  updateVideoProject,
  VideoProject
} from "./services/firebaseService";
import { useTheme } from "./hooks/useTheme";
import { Header } from "./components/Header";
import { ImageUpload } from "./components/ImageUpload";
import { VideoPlayer } from "./components/VideoPlayer";
import { Loader } from "./components/Loader";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Textarea } from "./components/ui/Textarea";
import { Label } from "./components/ui/Label";
import { Select } from "./components/ui/Select";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/Card";
import { Alert } from "./components/Alert";
import { GallerySidebar } from "./components/GallerySidebar";
import { QuickActions } from "./components/QuickActions";
import { ContextPanel } from "./components/ContextPanel";
import { blobToBase64 } from "./utils/blob";
import { VideoConfigPreview } from "./components/VideoConfigPreview";
import { CameraPresets } from "./components/CameraPresets";
import { useToast } from "./components/Toast";
import { KeyboardShortcutsHelp } from "./components/KeyboardShortcutsHelp";
import { VideoModal } from "./components/VideoModal";
import type { VeoResponse, VideoResolution, MusicTrack, CameraMovement, MovementSpeed, Duration } from "./types";

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio: AIStudio;
  }
}

const musicTracks: MusicTrack[] = [
  { name: "Ninguna", url: "" },
  { name: "Ambient Tranquilo", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Videos/Kie_LoKaz/The_Architect/Kie_LoKaz_-_05_-_The_Architect.mp3" },
  { name: "Corporativo Enérgico", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Monplaisir/Antigravity/Monplaisir_-_04_-_Antigravity.mp3" },
  { name: "Lounge Moderno", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Field_Report_Volume_III_The_Cali_Sessions/Chad_Crouch_-_21_-_Shipping_Lanes.mp3" },
];

const App: React.FC = () => {
  // Theme
  const { theme, changeTheme } = useTheme();

  // Toast notifications
  const { showToast, ToastContainer } = useToast();

  // Auth
  const [user, setUser] = useState<User | null>(null);

  // Core state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [resolution, setResolution] = useState<VideoResolution>("720p");
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack>(musicTracks[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  // Camera config
  const [cameraMovement, setCameraMovement] = useState<CameraMovement>("static");
  const [movementSpeed, setMovementSpeed] = useState<MovementSpeed>("medium");
  const [duration, setDuration] = useState<Duration>("6s");
  const [intensity, setIntensity] = useState<number>(5);

  // Gallery & Context
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [showGallery, setShowGallery] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Video modal
  const [modalProject, setModalProject] = useState<VideoProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadProjects();
      } else {
        setProjects([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter: Generate video
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && imageFile && !isLoading) {
        e.preventDefault();
        handleGenerateVideo();
        showToast('Generando video... (⌘+Enter)', 'info');
      }

      // Cmd/Ctrl + S: Save project
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && videoUrl && user) {
        e.preventDefault();
        handleSaveContext();
      }

      // Cmd/Ctrl + D: Download video
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && videoUrl) {
        e.preventDefault();
        handleDownload();
        showToast('Descargando video... (⌘+D)', 'info');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageFile, isLoading, videoUrl, user]);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    } else {
      setApiKeySelected(true);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Error al iniciar sesión");
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setVideoUrl(null);
      setImageFile(null);
      setPrompt("");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setVideoUrl(null);
    setError(null);
  };

  const handlePresetSelect = (preset: { movement: CameraMovement; speed: MovementSpeed; duration: Duration; intensity: number }) => {
    setCameraMovement(preset.movement);
    setMovementSpeed(preset.speed);
    setDuration(preset.duration);
    setIntensity(preset.intensity);
  };

  const handleGenerateVideo = async () => {
    if (!imageFile) {
      setError("Sube una imagen primero");
      return;
    }

    if (!apiKeySelected) {
      handleSelectApiKey();
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const base64Image = await blobToBase64(imageFile);
      const mimeType = imageFile.type;

      // Build enhanced prompt with camera parameters
      const movementDescriptions: Record<CameraMovement, string> = {
        'static': 'static camera, no movement',
        'pan-left': 'smooth camera pan to the left',
        'pan-right': 'smooth camera pan to the right',
        'tilt-up': 'camera tilts upward',
        'tilt-down': 'camera tilts downward',
        'zoom-in': 'camera zooms in slowly',
        'zoom-out': 'camera zooms out slowly',
        'dolly-in': 'camera dollies in towards subject',
        'dolly-out': 'camera dollies out from subject',
        'orbit': 'camera orbits around the subject',
        'crane': 'crane shot moving elegantly'
      };

      const speedDescriptions: Record<MovementSpeed, string> = {
        'slow': 'very slow and cinematic',
        'medium': 'at a moderate pace',
        'fast': 'quickly and dynamically'
      };

      const enhancedPrompt = `${movementDescriptions[cameraMovement]} ${speedDescriptions[movementSpeed]}, ${duration} duration${prompt ? `. ${prompt}` : ''}. Professional cinematography, smooth motion, high quality rendering.`;

      const result: VeoResponse = await generateVideoFromImage(
        base64Image,
        mimeType,
        enhancedPrompt,
        resolution
      );

      if (result.videoUrl) {
        setVideoUrl(result.videoUrl);
        showToast('Video generado exitosamente', 'success');

        // Auto-save project if user is logged in
        if (user && imageFile) {
          setTimeout(async () => {
            try {
              const imagePath = `users/${user.uid}/images/${Date.now()}_${imageFile.name}`;
              const imageUrl = await uploadFile(imageFile, imagePath);

              const videoBlob = await fetch(result.videoUrl!).then(r => r.blob());
              const videoPath = `users/${user.uid}/videos/${Date.now()}.mp4`;
              const videoStorageUrl = await uploadFile(videoBlob, videoPath);

              const project: Omit<VideoProject, 'id'> = {
                userId: user.uid,
                userEmail: user.email || '',
                userName: user.displayName || undefined,
                userPhoto: user.photoURL || undefined,
                imageUrl,
                videoUrl: videoStorageUrl,
                prompt,
                resolution,
                musicTrack: selectedMusic.name,
                tags: [],
                description: '',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                cameraMovement,
                movementSpeed,
                duration,
                intensity,
              };

              const projectId = await saveVideoProject(project);
              setCurrentProjectId(projectId);
              await loadProjects();
              showToast('Proyecto guardado automáticamente', 'success');
            } catch (error) {
              console.error('Error auto-saving project:', error);
              showToast('El video se generó, pero hubo un error al guardarlo', 'warning');
            }
          }, 1000);
        }
      } else if (result.error) {
        setError(result.error);
        showToast(result.error, 'error');
        if (result.error.includes("Requested entity was not found.")) {
          setApiKeySelected(false);
        }
      }
    } catch (e: any) {
      console.error("Video generation failed:", e);
      const errorMsg = e.message || "Error generando el video";
      setError(errorMsg);
      showToast(errorMsg, 'error');
      if (e.message?.includes("Requested entity was not found.")) {
        setApiKeySelected(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectApiKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setApiKeySelected(true);
        setError(null);
      } catch (e) {
        console.error("Error opening API key selection:", e);
        setError("No se pudo abrir la selección de clave API");
      }
    } else {
      setError("Gestión de claves no disponible");
    }
  };

  const handleSaveContext = async () => {
    if (!user) {
      setError("Debes iniciar sesión para guardar proyectos");
      return;
    }

    if (!videoUrl) {
      setError("Primero genera un video para guardarlo");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (currentProjectId) {
        // Update existing project
        await updateVideoProject(currentProjectId, {
          description,
          tags,
          updatedAt: Timestamp.now()
        });
      } else {
        // Create new project
        const imagePath = `users/${user.uid}/images/${Date.now()}_${imageFile?.name || 'image.jpg'}`;
        const imageUrl = imageFile ? await uploadFile(imageFile, imagePath) : '';

        const videoBlob = await fetch(videoUrl).then(r => r.blob());
        const videoPath = `users/${user.uid}/videos/${Date.now()}.mp4`;
        const videoStorageUrl = await uploadFile(videoBlob, videoPath);

        const project: Omit<VideoProject, 'id'> = {
          userId: user.uid,
          userEmail: user.email || '',
          userName: user.displayName || undefined,
          userPhoto: user.photoURL || undefined,
          imageUrl,
          videoUrl: videoStorageUrl,
          prompt,
          resolution,
          musicTrack: selectedMusic.name,
          tags,
          description,
          createdAt: Timestamp.now(),
          // Add camera config (these might not be in VideoProject type yet, but we'll add them)
          cameraMovement: cameraMovement,
          movementSpeed: movementSpeed,
          duration: duration,
          intensity: intensity,
        };

        const projectId = await saveVideoProject(project);
        setCurrentProjectId(projectId);
      }

      await loadProjects();
      showToast('Proyecto guardado exitosamente', 'success');

    } catch (error: any) {
      console.error("Error saving project:", error);
      const errorMsg = error.message || "Error al guardar el proyecto. Por favor, intenta de nuevo.";
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectProject = (project: VideoProject) => {
    setVideoUrl(project.videoUrl);
    setPrompt(project.prompt);
    setResolution(project.resolution as VideoResolution);
    const music = musicTracks.find(m => m.name === project.musicTrack) || musicTracks[0];
    setSelectedMusic(music);
    setDescription(project.description || '');
    setTags(project.tags || []);
    setCurrentProjectId(project.id || null);

    // Load camera config if available
    if (project.cameraMovement) setCameraMovement(project.cameraMovement as CameraMovement);
    if (project.movementSpeed) setMovementSpeed(project.movementSpeed as MovementSpeed);
    if (project.duration) setDuration(project.duration as Duration);
    if (project.intensity) setIntensity(project.intensity);
  };

  const handleOpenModal = (project: VideoProject) => {
    setModalProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalProject(null), 300);
  };

  const handleDownload = () => {
    if (!videoUrl) return;

    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `video_${Date.now()}.mp4`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-foreground">
      <ToastContainer />

      <Header
        theme={theme}
        onThemeChange={changeTheme}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <GallerySidebar
        projects={projects}
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onToggle={() => setShowGallery(!showGallery)}
        onSelectProject={handleSelectProject}
        onOpenModal={handleOpenModal}
        isLoading={isLoadingProjects}
      />

      <VideoModal
        project={modalProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <main className={`transition-all duration-300 ${showGallery ? 'mr-80' : 'mr-0'}`}>
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Inputs (wider) */}
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-800">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inputs</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Image Upload */}
                  <div className="space-y-1.5">
                    <Label>Imagen</Label>
                    <ImageUpload onImageUpload={handleImageUpload} />
                  </div>

                  {/* Camera Presets */}
                  <CameraPresets onSelectPreset={handlePresetSelect} />

                  {/* Prompt */}
                  <div className="space-y-1.5">
                    <Label>Descripción adicional (opcional)</Label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Detalles adicionales de la escena..."
                      className="resize-none h-12"
                    />
                  </div>

                  {/* Camera Movement */}
                  <div className="space-y-1.5">
                    <Label>Movimiento de Cámara</Label>
                    <Select
                      value={cameraMovement}
                      onChange={(e) => setCameraMovement(e.target.value as CameraMovement)}
                    >
                      <option value="static">Estático</option>
                      <option value="pan-left">Paneo Izquierda</option>
                      <option value="pan-right">Paneo Derecha</option>
                      <option value="tilt-up">Inclinación Arriba</option>
                      <option value="tilt-down">Inclinación Abajo</option>
                      <option value="zoom-in">Zoom In</option>
                      <option value="zoom-out">Zoom Out</option>
                      <option value="dolly-in">Dolly In</option>
                      <option value="dolly-out">Dolly Out</option>
                      <option value="orbit">Órbita</option>
                      <option value="crane">Grúa</option>
                    </Select>
                  </div>

                  {/* Speed, Duration, Intensity Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Speed */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Velocidad</Label>
                      <Select
                        value={movementSpeed}
                        onChange={(e) => setMovementSpeed(e.target.value as MovementSpeed)}
                        className="text-xs"
                      >
                        <option value="slow">Lento</option>
                        <option value="medium">Medio</option>
                        <option value="fast">Rápido</option>
                      </Select>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Duración</Label>
                      <Select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value as Duration)}
                        className="text-xs"
                      >
                        <option value="4s">4s</option>
                        <option value="6s">6s</option>
                        <option value="8s">8s</option>
                      </Select>
                    </div>

                    {/* Intensity */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Intensidad</Label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={intensity}
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  {/* Settings Grid (2 columns) */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Resolution */}
                    <div className="space-y-1.5">
                      <Label>Calidad</Label>
                      <div className="space-y-1.5">
                        <Button
                          onClick={() => setResolution("720p")}
                          variant={resolution === "720p" ? "default" : "outline"}
                          className="w-full"
                          size="sm"
                        >
                          720p
                        </Button>
                        <Button
                          onClick={() => setResolution("1080p")}
                          variant={resolution === "1080p" ? "default" : "outline"}
                          className="w-full"
                          size="sm"
                        >
                          1080p
                        </Button>
                      </div>
                    </div>

                    {/* Music */}
                    <div className="space-y-1.5">
                      <Label>Música</Label>
                      <Select
                        value={selectedMusic.name}
                        onChange={(e) => {
                          const track = musicTracks.find(t => t.name === e.target.value);
                          if (track) setSelectedMusic(track);
                        }}
                      >
                        {musicTracks.map(track => (
                          <option key={track.name} value={track.name}>
                            {track.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isLoading || !imageFile}
                    className="w-full"
                  >
                    {isLoading ? "Generando..." : "Generar Video"}
                  </Button>

                  {!apiKeySelected && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md text-center">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                        Se requiere clave API
                      </p>
                      <button
                        onClick={handleSelectApiKey}
                        className="text-xs px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md shadow-sm"
                      >
                        Seleccionar
                      </button>
                    </div>
                  )}

                  {error && <Alert message={error} />}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Video Output + Context */}
            <div className="col-span-12 lg:col-span-8">
              <div className="space-y-6">
                {/* Video Output */}
                <Card className="bg-white dark:bg-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Video Output</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </Button>
                    </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="bg-muted rounded-lg min-h-[400px] flex items-center justify-center">
                      {isLoading && <Loader />}
                      {!isLoading && !videoUrl && !error && (
                        <div className="text-center text-muted-foreground">
                          <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">El video aparecerá aquí</p>
                        </div>
                      )}
                      {videoUrl && <VideoPlayer src={videoUrl} musicUrl={selectedMusic.url} />}
                    </div>
                  </CardContent>
                </Card>

                {/* Video Configuration Preview */}
                <VideoConfigPreview
                  movement={cameraMovement}
                  speed={movementSpeed}
                  duration={duration}
                  intensity={intensity}
                  resolution={resolution}
                  musicTrack={selectedMusic.name}
                  prompt={prompt}
                />

                {/* Quick Actions */}
                {videoUrl && (
                  <QuickActions
                    videoUrl={videoUrl}
                    onDownload={handleDownload}
                    onRegenerate={() => {
                      setVideoUrl(null);
                      setCurrentProjectId(null);
                    }}
                  />
                )}

                {/* Context Panel */}
                {videoUrl && (
                  <ContextPanel
                    description={description}
                    tags={tags}
                    onDescriptionChange={setDescription}
                    onTagsChange={setTags}
                    onSave={handleSaveContext}
                    isSaving={isSaving}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <KeyboardShortcutsHelp />
    </div>
  );
};

export default App;
