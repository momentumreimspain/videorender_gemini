import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onImageUpload(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full h-36 border-2 border-dashed rounded-lg flex items-center justify-center text-center p-4 cursor-pointer transition-all duration-200
        ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary hover:bg-muted/50 bg-muted/30"
        }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img
          src={preview}
          alt="Render preview"
          className="max-h-full max-w-full object-contain rounded-md"
        />
      ) : (
        <div className="text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm">
            {isDragActive
              ? "Suelta el render aquí..."
              : "Arrastra y suelta el render aquí, o haz clic para seleccionar"}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG hasta 10MB</p>
        </div>
      )}
    </div>
  );
};
