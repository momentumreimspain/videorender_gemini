import { GoogleGenAI } from "@google/genai";
import type { VeoResponse, VideoResolution } from '../types';

async function pollOperation<T>(operation: any, ai: GoogleGenAI): Promise<any> {
  let currentOperation = operation;
  while (!currentOperation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
    try {
      currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
    } catch(e) {
      console.error("Polling failed", e);
      throw new Error("Failed to get video generation status.");
    }
  }
  return currentOperation;
}


export const generateVideoFromImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  resolution: VideoResolution
): Promise<VeoResponse> => {
  if (!process.env.API_KEY) {
    return { error: 'API key not found. Please select your API Key.' };
  }

  // Create a new instance for each call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this scene with a person moving naturally.',
      image: {
        imageBytes: base64Image,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: resolution,
        aspectRatio: '16:9'
      }
    });

    const finalOperation = await pollOperation(operation, ai);

    // Log the full response for debugging
    console.log('Final operation response:', JSON.stringify(finalOperation, null, 2));

    const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      console.error('No download link found in operation response:', finalOperation);

      // Check for specific error reasons
      const errorMessage = finalOperation.response?.error?.message ||
                          finalOperation.error?.message ||
                          'Video generation completed, but no video URL was returned.';

      const safetyIssue = finalOperation.response?.generatedVideos?.[0]?.finishReason;

      if (safetyIssue && safetyIssue !== 'SUCCESS') {
        return { error: `Video generation blocked: ${safetyIssue}. Try a different prompt or image.` };
      }

      return { error: errorMessage };
    }
    
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to download video:', errorText);
        return { error: `Failed to download the generated video. Status: ${response.status}`};
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    return { videoUrl };

  } catch (error: any) {
    console.error('Error generating video:', error);
    if (error.message && error.message.includes("API key not valid")) {
       return { error: "The selected API key is not valid. Please select a valid key and try again." };
    }
    if (error.message && error.message.includes("Requested entity was not found.")) {
        return { error: "API Key not found. Please select your API Key again."};
    }
    return { error: error.message || 'An unknown error occurred while generating the video.' };
  }
};