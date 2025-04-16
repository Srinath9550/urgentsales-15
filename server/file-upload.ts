import * as path from 'path';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import multer from 'multer';
import { Request } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';



// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
fs.ensureDirSync(UPLOAD_DIR);

// We're no longer using disk storage, all uploads go to S3
// This is kept for reference only
const legacyDiskStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const userId = req.user?.id || `anonymous-${Date.now()}`;
      const userDir = `user-${userId.toString()}`;
      const uploadPath = path.join(process.cwd(), 'uploads', userDir);
      console.log(`[LEGACY] Destination directory for upload: ${uploadPath}`);
      
      // Use fs-extra's ensureDir instead of existsSync/mkdirSync
      await fs.ensureDir(uploadPath);
      
      console.log(`[LEGACY] Storing file in: ${uploadPath}`);
      cb(null, uploadPath);
    } catch (err) {
      console.error('[LEGACY] Error creating upload directory:', err);
      cb(err as Error, '');
    }
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    console.log(`[LEGACY] Generated filename: ${uniqueFilename}`);
    cb(null, uniqueFilename);
  }
});

// File filter to only allow certain types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Supported types: ${allowedMimes.join(', ')}`));
  }
};

// Configure limits
const limits = {
  fileSize: 20 * 1024 * 1024, // 20MB
  files: 25 // Max 25 files per upload
};





// We're no longer using disk storage, all uploads go to S3
// This is kept for reference only
const legacyDiskStorage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure S3
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_KEY || ''
  }
});

// Log S3 configuration for debugging
console.log('S3 Configuration:', {
  bucketName: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_BUCKET_REGION,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY,
  hasSecretKey: !!process.env.AWS_SECRET_KEY
});

// Use memory storage to ensure we have the buffer available
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory to ensure buffer is available
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
    files: 25 // Max 25 files per upload
  },
  fileFilter
});

// Create a middleware to handle S3 uploads after multer processes the files
export const processS3Upload = async (req: any, res: any, next: any) => {
  try {
    // Skip if no files
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      console.log('No files to process for S3 upload');
      return next();
    }
    
    console.log(`Processing ${req.files.length} files for S3 upload`);
    
    // Import the S3 upload function
    const { uploadToS3 } = await import('./s3-service');
    
    // Track the original files
    req.originalFiles = [...req.files];
    
    // Process each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      // Skip invalid files
      if (!file || !file.buffer || file.size === 0) {
        console.warn(`Skipping invalid file for S3 upload: ${file?.originalname || 'unknown'}`);
        continue;
      }
      
      // Generate user ID
      const userId = req.user?.id || `anonymous-${Date.now()}`;
      
      // Upload to S3
      try {
        const s3Key = await uploadToS3(file, `properties/user-${userId}`);
        
        // Store the S3 key in the file object
        if (s3Key) {
          file.s3Key = s3Key;
          console.log(`✅ S3 upload successful: ${file.originalname} → ${s3Key}`);
        } else {
          console.error(`❌ S3 upload failed for file: ${file.originalname}`);
        }
      } catch (error) {
        console.error(`Error uploading file to S3: ${file.originalname}`, error);
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in S3 upload middleware:', error);
    next(error);
  }
};

export { upload };

// Function to get the public URL for a file
export function getFileUrl(filename: string, userId: number | string): string {
  // If no filename provided, return empty string
  if (!filename) {
    console.log('No filename provided to getFileUrl');
    return '';
  }

  console.log(`Getting URL for file: ${filename}, userId: ${userId}`);
  
  // Special case for "pending-upload" placeholder
  if (filename === 'pending-upload') {
    console.log('Handling pending-upload placeholder');
    return 'pending-upload';
  }
  
  // Special case for blob URLs (client-side only, should be replaced before saving)
  if (filename.startsWith('blob:')) {
    console.log('Detected blob URL, returning pending-upload placeholder');
    return 'pending-upload';
  }
  
  // CASE 1: If it's already a full URL, return it as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    console.log(`Using existing full URL: ${filename}`);
    return filename;
  }
  
  // CASE 2: If it's an S3 URL without protocol, add https://
  if (filename.includes('amazonaws.com')) {
    const fullUrl = filename.startsWith('https://') ? filename : `https://${filename}`;
    console.log(`Formatted S3 URL: ${fullUrl}`);
    return fullUrl;
  }
  
  // CASE 3: For all other cases, treat as S3 key/path
  // Clean up the filename - remove any leading slashes
  const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename;
  
  // Construct the S3 URL
  const bucketName = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';
  const region = process.env.AWS_BUCKET_REGION || 'ap-south-1';
  const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${cleanFilename}`;
  
  console.log(`Generated S3 URL: ${s3Url}`);
  return s3Url;
}

// Function to delete a file
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // Strip the leading slash if it exists
    const cleanUrl = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
    const filePath = path.join(process.cwd(), cleanUrl);
    
    // Check if file exists
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}