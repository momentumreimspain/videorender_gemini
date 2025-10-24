
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // The result includes the data URI prefix (e.g., "data:image/png;base64,"), we need to remove it.
      const parts = base64String.split(',');
      if (parts.length > 1) {
        resolve(parts[1]);
      } else {
        reject(new Error("Invalid base64 string format"));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};
