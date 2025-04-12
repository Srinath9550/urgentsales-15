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

// Configure multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const userId = req.user?.id || 'anonymous';
      const userDir = `user-${userId.toString()}`;
      const uploadPath = path.join(process.cwd(), 'uploads', userDir);
      
      // Use fs-extra's ensureDir instead of existsSync/mkdirSync
      await fs.ensureDir(uploadPath);
      
      console.log(`Storing file in: ${uploadPath}`);
      cb(null, uploadPath);
    } catch (err) {
      console.error('Error creating upload directory:', err);
      cb(err as Error, '');
    }
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    console.log(`Generated filename: ${uniqueFilename}`);
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





// Rename storage to diskStorage to avoid conflict
const diskStorage = multer.diskStorage({
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
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
});

// Configure multer with S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME!,
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'properties/' + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

export { upload };

// Function to get the public URL for a file
export function getFileUrl(filename: string, userId: number | string): string {
  // Ensure userId is a valid value - if it's NaN or undefined, use 'anonymous'
  const userIdStr = userId ? String(userId).replace(/NaN|undefined/g, 'anonymous') : 'anonymous';
  
  // Always clean up the filename to make it URL-safe
  const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  
  // Use absolute URL for production or relative URL for development
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.API_BASE_URL || 'https://urgentrealestate.com'
    : '';
    
  // Create a user-specific directory path
  const userDir = `user-${userIdStr}`;
  
  // Ensure the user directory exists
  const userDirPath = path.join(process.cwd(), 'uploads', userDir);
  // Use fs-extra's ensureDirSync instead of existsSync/mkdirSync
  fs.ensureDirSync(userDirPath);
  
  // Make sure the URL is properly formatted for web access
  // This ensures the URL starts with a slash and doesn't have double slashes
  const relativePath = `/uploads/${userDir}/${safeFilename}`;
  
  console.log(`Generated file URL: ${baseUrl}${relativePath}`);
  
  return `${baseUrl}${relativePath}`;
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