import React, { useState, useCallback, useEffect } from "react";
import { generateVideoFromImage } from "./services/geminiService";
import { Header } from "./components/Header";
import { ImageUpload } from "./components/ImageUpload";
import { VideoPlayer } from "./components/VideoPlayer";
import { Loader } from "./components/Loader";
import { Button } from "./components/Button";
import { Alert } from "./components/Alert";
import { blobToBase64 } from "./utils/blob";
import type { VeoResponse, VideoResolution, MusicTrack } from "./types";

// Fix: Resolved a TypeScript declaration conflict with `window.aistudio` by defining and using a global `AIStudio` interface. This allows for declaration merging and ensures type compatibility across the application.
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
  { name: "None", url: "" },
  {
    name: "Calm Ambient",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Videos/Kie_LoKaz/The_Architect/Kie_LoKaz_-_05_-_The_Architect.mp3",
  },
  {
    name: "Upbeat Corporate",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Monplaisir/Antigravity/Monplaisir_-_04_-_Antigravity.mp3",
  },
  {
    name: "Modern Lounge",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Field_Report_Volume_III_The_Cali_Sessions/Chad_Crouch_-_21_-_Shipping_Lanes.mp3",
  },
];

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [resolution, setResolution] = useState<VideoResolution>("720p");
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack>(
    musicTracks[0]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    } else {
      // If aistudio is not available, assume we are in a dev environment
      // where the key is set via environment variables.
      setApiKeySelected(true);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setVideoUrl(null);
    setError(null);
  };

  const handleGenerateVideo = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
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

      const result: VeoResponse = await generateVideoFromImage(
        base64Image,
        mimeType,
        prompt,
        resolution
      );

      if (result.videoUrl) {
        setVideoUrl(result.videoUrl);
      } else if (result.error) {
        setError(result.error);
        if (result.error.includes("Requested entity was not found.")) {
          setApiKeySelected(false);
        }
      }
    } catch (e: any) {
      console.error("Video generation failed:", e);
      let errorMessage =
        "An unexpected error occurred during video generation.";
      if (e.message) {
        errorMessage = e.message;
      }
      if (errorMessage.includes("Requested entity was not found.")) {
        setApiKeySelected(false);
        setError("API Key not found. Please select your API Key again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectApiKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume key selection is successful and let the next API call verify.
        setApiKeySelected(true);
        setError(null);
      } catch (e) {
        console.error("Error opening API key selection:", e);
        setError("Could not open the API key selection dialog.");
      }
    } else {
      setError("API key management is not available in this environment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Controls */}
          <div className="xl:col-span-1 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-6 overflow-y-auto">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-cyan-300">
                1. Upload Your Render
              </h2>
              <ImageUpload onImageUpload={handleImageUpload} />

              <h2 className="text-xl font-semibold text-cyan-300">
                2. Describe the Animation
              </h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A person calmly prepares breakfast in the morning light.' or 'A family enjoys a sunny afternoon by the pool.'"
                className="w-full h-24 p-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300 placeholder-gray-500 text-sm"
              />

              <h2 className="text-xl font-semibold text-cyan-300">
                3. Select Output Quality
              </h2>
              <div className="flex space-x-2 rounded-lg bg-gray-900/70 p-1 border border-gray-600">
                <button
                  type="button"
                  onClick={() => setResolution("720p")}
                  className={`w-full text-center px-3 py-2 rounded-md transition-colors duration-300 font-medium text-sm ${
                    resolution === "720p"
                      ? "bg-cyan-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  720p <span className="text-xs text-cyan-200">(Fast)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResolution("1080p")}
                  className={`w-full text-center px-3 py-2 rounded-md transition-colors duration-300 font-medium text-sm ${
                    resolution === "1080p"
                      ? "bg-cyan-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  1080p <span className="text-xs text-cyan-200">(HD)</span>
                </button>
              </div>

              <h2 className="text-xl font-semibold text-cyan-300">
                4. Add Background Music
              </h2>
              <div className="grid grid-cols-1 gap-2 rounded-lg bg-gray-900/70 p-1 border border-gray-600">
                {musicTracks.map((track) => (
                  <button
                    key={track.name}
                    type="button"
                    onClick={() => setSelectedMusic(track)}
                    className={`w-full text-center px-3 py-2 rounded-md transition-colors duration-300 font-medium text-sm ${
                      selectedMusic.url === track.url
                        ? "bg-cyan-600 text-white shadow-md"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {track.name}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleGenerateVideo}
                  disabled={isLoading || !imageFile}
                  className="w-full"
                >
                  {isLoading ? "Generating..." : "Animate Render"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Video Preview */}
          <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">
              Video Preview
            </h2>
            <div className="flex-1 flex items-center justify-center bg-gray-900/70 rounded-lg border border-gray-700 min-h-[500px]">
              {isLoading && <Loader />}
              {!isLoading && error && <Alert message={error} />}
              {!isLoading && !videoUrl && !error && (
                <div className="text-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-20 w-20 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.55a2 2 0 01.45 2.42l-2.5 5A2 2 0 0115.5 19H6.88a2 2 0 01-1.79-1.11L3 12.5V5a2 2 0 012-2h4l2 4h4a2 2 0 012 2z"
                    />
                  </svg>
                  <p className="mt-4 text-lg">
                    Your animated video will appear here.
                  </p>
                  <p className="text-sm">
                    Upload a render and describe the scene to start.
                  </p>
                </div>
              )}
              {videoUrl && (
                <VideoPlayer src={videoUrl} musicUrl={selectedMusic.url} />
              )}
            </div>
          </div>
        </div>

        {!apiKeySelected && (
          <div className="mt-6 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-center">
            <p className="mb-2 text-yellow-200">
              An API key is required for video generation. Please select your
              key to proceed.
              <a
                href="https://ai.google.dev/gemini-api/docs/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-yellow-100 ml-1"
              >
                Learn about billing
              </a>
              .
            </p>
            <Button
              onClick={handleSelectApiKey}
              className="bg-yellow-600 hover:bg-yellow-500 text-white"
            >
              Select API Key
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
