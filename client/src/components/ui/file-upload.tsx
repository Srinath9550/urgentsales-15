import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  X,
  Upload,
  File as FileIcon,
  Image,
  AlertCircle,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileWithPreview extends File {
  id: string;
  preview: string;
  name: string;
  file?: File; // Add optional file property to handle cases where file might be undefined
}

interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accepts?: Record<string, string[]> | string[]; // Update to support both formats
  onFilesSelected: (files: FileWithPreview[]) => void;
  onFileRemoved: (fileId: string) => void;
  files: FileWithPreview[];
  showFileNames?: boolean;
}

export function FileUpload({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accepts = ["image/*"],
  onFilesSelected,
  onFileRemoved,
  files = [],
  showFileNames = false,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // Check if adding these files would exceed the max count
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }

      // Process files with previews and IDs with proper null checks
      const newFiles = acceptedFiles
        .map((file) => {
          if (!file) return null;

          try {
            // Create a preview URL for images and videos
            const preview = URL.createObjectURL(file);

            // Add unique ID and preview to file
            return Object.assign(file, {
              id: crypto.randomUUID(),
              preview,
              name: file.name || "Unnamed file",
              file: file, // Store the original file object
            });
          } catch (error) {
            console.error("Error processing file:", error);
            return null;
          }
        })
        .filter(Boolean) as FileWithPreview[]; // Filter out any null values

      // Simulate upload progress for each file
      newFiles.forEach((file) => {
        if (!file || !file.id) return;

        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setUploadProgress((prev) => ({
            ...prev,
            [file.id]: progress,
          }));

          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);
      });

      onFilesSelected(newFiles.length > 0 ? [...files, ...newFiles] : files);
    },
    [files, maxFiles, onFilesSelected],
  );

  // Convert accepts format to match react-dropzone requirements
  const getAcceptFormat = () => {
    if (Array.isArray(accepts)) {
      return accepts.reduce(
        (acc, curr) => {
          acc[curr] = [];
          return acc;
        },
        {} as Record<string, string[]>,
      );
    }
    return accepts;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: getAcceptFormat(),
    maxFiles: maxFiles - files.length,
    onDropRejected: (rejections) => {
      // Handle file rejection (size, type, etc.)
      const rejection = rejections[0];
      if (rejection) {
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(
            `File is too large. Max size is ${maxSize / (1024 * 1024)}MB`,
          );
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          const acceptsStr = Array.isArray(accepts)
            ? accepts.join(", ")
            : Object.keys(accepts).join(", ");
          setError(`Invalid file type. Accepted types: ${acceptsStr}`);
        } else {
          setError(rejection.errors[0]?.message || "File upload failed");
        }
      }
    },
  });

  const removeFile = (fileId: string) => {
    if (!fileId) return;

    // Find the file to remove
    const fileToRemove = files.find((f) => f?.id === fileId);

    // Revoke the object URL to prevent memory leaks
    if (fileToRemove?.preview) {
      try {
        URL.revokeObjectURL(fileToRemove.preview);
      } catch (error) {
        console.error("Error revoking object URL:", error);
      }
    }

    // Remove from progress tracking
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      if (fileId in newProgress) {
        delete newProgress[fileId];
      }
      return newProgress;
    });

    // Call the parent handler
    onFileRemoved(fileId);
  };

  // Safe function to determine file type
  const getFileType = (file: FileWithPreview) => {
    if (!file) return "";
    return file.type || "";
  };

  // Safe function to get file size
  const getFileSize = (file: FileWithPreview) => {
    if (!file || typeof file.size !== "number") return "0 KB";
    return `${(file.size / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop files here"
              : `Drag & drop files here, or click to select`}
          </p>
          <p className="text-xs text-gray-500">
            {`Max ${maxFiles} files, up to ${maxSize / (1024 * 1024)}MB each`}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && showFileNames && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          <div className="space-y-2">
            {files.map((file) => {
              if (!file || !file.id) return null;

              const fileType = getFileType(file);

              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {fileType.startsWith("image/") ? (
                      <Image className="h-4 w-4 text-blue-500" />
                    ) : fileType.startsWith("video/") ? (
                      <Video className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileIcon className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm truncate max-w-[200px]">
                      {file.name || "Unnamed file"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getFileSize(file)}
                    </span>
                  </div>

                  {uploadProgress[file.id] && uploadProgress[file.id] < 100 ? (
                    <div className="w-24">
                      <Progress
                        value={uploadProgress[file.id]}
                        className="h-2"
                      />
                      <p className="text-xs text-center mt-1">
                        {uploadProgress[file.id]}%
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
