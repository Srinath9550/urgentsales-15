import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  X, 
  ImageIcon, 
  FileVideo, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface FileWithPreview {
  file: File;
  preview?: string;
  id: string;
  name?: string; // Added name property
  size?: number; // Added size property
  type?: string; // Added type property
  uploadProgress?: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
  serverUrl?: string; // Path to file on server after upload
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

interface FileUploadProps {
  onFilesSelected: (files: FileWithPreview[]) => void;
  onFileRemoved?: (fileId: string) => void;
  initialFiles?: FileWithPreview[];
  maxFiles?: number;
  maxSize?: number; // Maximum file size in bytes
  accepts?: string[]; // Array of accepted file types
  allowMultiple?: boolean;
  className?: string;
  files?: FileWithPreview[]; // Current files (for controlled components)
}

export default function FileUpload({
  onFilesSelected,
  onFileRemoved,
  initialFiles = [],
  maxFiles = 10,
  maxSize,
  accepts,
  allowMultiple = true,
  className = "",
  files: externalFiles,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>(externalFiles || initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Update files when external files change
  useEffect(() => {
    if (externalFiles) {
      setFiles(externalFiles);
    }
  }, [externalFiles]);

  // Generate unique ID for a file
  const generateFileId = () => {
    const randomString = Math.random().toString(36);
    if (!randomString) return `file-${Date.now()}`; // Fallback in case toString(36) fails
    return randomString.substring(2, 9);
  };

  // Handle file selection
  const handleFileSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Check if we're exceeding the maximum file limit
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload a maximum of ${maxFiles} files.`,
        variant: "destructive",
      });
      return;
    }

    const newFiles: FileWithPreview[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      // Validate file type
      const allowedTypes = accepts || ALLOWED_TYPES;
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (unsupported file type)`);
        return;
      }

      // Validate file size
      const maxFileSize = maxSize || MAX_FILE_SIZE;
      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (exceeds ${(maxFileSize / 1024 / 1024).toFixed(0)}MB limit)`);
        return;
      }

      // Create file preview
      const fileWithPreview: FileWithPreview = {
        file: file,
        id: generateFileId(),
        preview: URL.createObjectURL(file),
        uploadProgress: 0,
        status: 'uploading' as const
      };

      // Simulate upload progress
      simulateUploadProgress(fileWithPreview);

      newFiles.push(fileWithPreview);
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      toast({
        title: "Some files couldn't be added",
        description: (
          <ul className="list-disc pl-5 mt-2 text-sm">
            {invalidFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
    }

    // Update state and call callback
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  // Upload file to server
  const simulateUploadProgress = async (file: FileWithPreview) => {
    try {
      // If this is an existing file with a serverUrl already, don't re-upload it
      if (file.serverUrl && file.status === 'success') {
        console.log('File already uploaded, skipping:', file.file.name);
        return;
      }
      
      // Start with initial progress
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                uploadProgress: 10, 
                status: 'uploading' as const
              } 
            : f
        )
      );
      
      // Create form data
      const formData = new FormData();
      formData.append('files', file.file);
      
      // Show progress at 50% while uploading
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id 
            ? { ...f, uploadProgress: 50, status: 'uploading' as const } 
            : f
        )
      );
      
      // Upload file to server
      console.log('Uploading file to server:', file.file.name);
      const responseData = await apiRequest<{ files: string[] }>({
        url: '/api/upload/property-images',
        method: 'POST',
        body: formData,
        headers: {} // Let the browser set the correct content-type for form data
      });
      
      if (responseData && responseData.files && responseData.files.length > 0) {
        console.log('File uploaded successfully. Server URL:', responseData.files[0]);
        // Update file with server URL
        setFiles(prevFiles => {
          const updatedFiles = prevFiles.map(f => 
            f.id === file.id 
              ? { 
                  ...f, 
                  uploadProgress: 100, 
                  status: 'success' as const,
                  // Add server URL to the file object
                  serverUrl: responseData.files[0]
                } 
              : f
          );
          
          // Notify parent component about the updated files
          onFilesSelected(updatedFiles);
          
          return updatedFiles;
        });
      } else {
        throw new Error('No file URLs returned from server');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                uploadProgress: 0, 
                status: 'error' as const,
                errorMessage: error instanceof Error ? error.message : 'Upload failed'
              } 
            : f
        );
        
        // Notify parent component about the updated files
        onFilesSelected(updatedFiles);
        
        return updatedFiles;
      });
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle remove file
  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    setFiles(files.filter(f => f.id !== fileId));
    
    if (onFileRemoved) {
      onFileRemoved(fileId);
    }
  };

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  // Get file type icon
  const getFileTypeIcon = (file: FileWithPreview) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.file.type)) {
      return <ImageIcon className="h-6 w-6 text-gray-400" />;
    } else if (ALLOWED_VIDEO_TYPES.includes(file.file.type)) {
      return <FileVideo className="h-6 w-6 text-gray-400" />;
    }
    return null;
  };

  // Get status icon
  const getStatusIcon = (file: FileWithPreview) => {
    switch (file.status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {/* Drag and drop area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors duration-150 ease-in-out
          flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          onChange={handleFileInputChange}
          accept={accepts ? accepts.join(',') : ALLOWED_TYPES.join(',')}
          className="hidden"
        />
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium mb-1">
          Drag & Drop or Click to Upload
        </h3>
        <p className="text-sm text-gray-500 mb-2 text-center">
          Upload property images or videos (up to {((maxSize || MAX_FILE_SIZE) / 1024 / 1024).toFixed(0)}MB each)
        </p>
        <p className="text-xs text-gray-400 text-center">
          Supported formats: {accepts ? accepts.map(type => type.replace('image/', '').replace('video/', '').toUpperCase()).join(', ') : 'JPEG, PNG, WebP, MP4, MPEG, QuickTime, WebM'}
        </p>
        {files.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {files.length} of {maxFiles} files uploaded
          </div>
        )}
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Select Files
        </Button>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    {/* Preview or icon */}
                    {file.preview && ALLOWED_IMAGE_TYPES.includes(file.file.type) ? (
                      <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                        {getFileTypeIcon(file)}
                      </div>
                    )}

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {/* Progress bar */}
                      <div className="mt-2 flex items-center space-x-2">
                        <Progress value={file.uploadProgress} className="h-1.5 flex-1" />
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          {getStatusIcon(file)}
                          <span>{file.uploadProgress}%</span>
                        </span>
                      </div>
                      
                      {/* Error message if any */}
                      {file.status === 'error' && file.errorMessage && (
                        <p className="text-xs text-red-500 mt-1">{file.errorMessage}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}