import * as path from 'path';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import multer from 'multer';
import { Request } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
      const uploadPath = path.join('uploads', userId.toString());
      
      // Use fs-extra's ensureDir instead of existsSync/mkdirSync
      await fs.ensureDir(uploadPath);
      
      cb(null, uploadPath);
    } catch (err) {
      cb(err as Error, '');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
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

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits
});

// Function to get the public URL for a file
export function getFileUrl(filename: string, userId: number | string): string {
  // Ensure userId is a valid value - if it's NaN or undefined, use 'anonymous'
  const userIdStr = userId ? String(userId).replace(/NaN|undefined/g, 'anonymous') : 'anonymous';
  
  // Always clean up the filename to make it URL-safe
  const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  
  return `/uploads/user-${userIdStr}/${safeFilename}`;
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