import { Request, Response } from 'express';
import { upload, getFileUrl } from './file-upload';
import * as path from 'path';
import * as fs from 'fs-extra';

// Handle property image uploads
export async function handlePropertyImageUpload(req: Request, res: Response) {
  try {
    console.log('Property image upload request received');
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);
    
    // Check if files exist in the request
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No files uploaded',
        message: 'Please select at least one file to upload'
      });
    }
    
    // Get user ID for file organization
    const userId = req.user?.id || 'anonymous';
    console.log(`Processing upload for user: ${userId}`);
    
    // Process uploaded files
    const uploadedFiles = req.files as Express.Multer.File[];
    console.log(`Processing ${uploadedFiles.length} files`);
    
    // Generate URLs for the uploaded files
    const fileUrls = uploadedFiles.map(file => {
      console.log(`File uploaded: ${file.filename} (${file.mimetype})`);
      return getFileUrl(file.filename, userId);
    });
    
    // Return the file URLs to the client
    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files: fileUrls
    });
  } catch (error) {
    console.error('Error handling property image upload:', error);
    return res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error during upload'
    });
  }
}