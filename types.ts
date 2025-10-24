
export type VideoResolution = '720p' | '1080p';

export interface VeoResponse {
  videoUrl?: string;
  error?: string;
}

export interface MusicTrack {
    name: string;
    url: string;
}
