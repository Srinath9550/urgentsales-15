import { Request, Response } from 'express';
import { upload, getFileUrl } from './file-upload';
import * as path from 'path';
import * as fs from 'fs-extra';

// Handle property image uploads
export async function handlePropertyImageUpload(req: Request, res: Response) {
  try {
    console.log('Property image upload request received');
    console.log('Request files:', req.files ? (Array.isArray(req.files) ? `${req.files.length} files` : 'Not an array') : 'No files');
    
    // Check if files exist in the request
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      console.log('No files uploaded. Skipping file upload process.');
      return res.status(400).json({ 
        success: false,
        error: 'No files uploaded',
        message: 'Please select at least one file to upload'
      });
    }
    
    // Check for empty files
    const nonEmptyFiles = (req.files as Express.Multer.File[]).filter(file => file.size > 0);
    
    // Log file details for debugging
    (req.files as Express.Multer.File[]).forEach((file, index) => {
      console.log(`File ${index + 1} details:`, {
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        hasBuffer: !!file.buffer,
        bufferLength: file.buffer ? file.buffer.length : 0
      });
    });
    
    if (nonEmptyFiles.length === 0) {
      console.log('All uploaded files are empty (0 bytes). Skipping upload process.');
      return res.status(400).json({
        success: false,
        error: 'Empty files',
        message: 'All uploaded files are empty (0 bytes)'
      });
    }
    
    // Get user ID for file organization
    const userId = req.user?.id || `anonymous-${Date.now()}`;
    console.log(`Processing upload for user: ${userId}`);
    
    // Log additional request information for debugging
    console.log('Request headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Process uploaded files
    const uploadedFiles = req.files as Express.Multer.File[];
    console.log(`Processing ${uploadedFiles.length} files for upload`);
    
    // Log file details for debugging
    uploadedFiles.forEach((file, index) => {
      console.log(`File ${index + 1}: ${file.originalname}, Size: ${file.size} bytes, Type: ${file.mimetype}`);
    });
    
    // Filter out empty files
    const validFiles = uploadedFiles.filter(file => file.size > 0);
    if (validFiles.length < uploadedFiles.length) {
      console.warn(`Filtered out ${uploadedFiles.length - validFiles.length} empty files`);
    }
    
    if (validFiles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid files to upload',
        message: 'All files were empty or invalid'
      });
    }
    
    // Import the S3 upload function
    const { uploadToS3 } = await import('./s3-service');
    
    // Files should already be uploaded to S3 by the processS3Upload middleware
    console.log(`Processing ${validFiles.length} files with S3 keys...`);
    
    // Track upload results
    const uploadResults = [];
    const successfulUploads = [];
    
    // Process files to extract S3 keys
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      console.log(`Processing file ${i+1}/${validFiles.length}: ${file.originalname} (${file.size} bytes)`);
      
      // Check if the file has an S3 key from the middleware
      if (file.s3Key) {
        console.log(`✅ Found S3 key for file: ${file.originalname} → ${file.s3Key}`);
        
        // Track the result
        uploadResults.push({
          filename: file.originalname,
          size: file.size,
          success: true,
          s3Key: file.s3Key
        });
        
        // Add to successful uploads
        successfulUploads.push(file.s3Key);
      } else {
        console.warn(`⚠️ No S3 key found for file: ${file.originalname}`);
        
        // Try to upload it now if it wasn't uploaded by the middleware
        try {
          // Import the S3 upload function
          const { uploadToS3 } = await import('./s3-service');
          
          // Upload to S3
          const s3Key = await uploadToS3(file, `properties/user-${userId}`);
          
          // Track the result
          uploadResults.push({
            filename: file.originalname,
            size: file.size,
            success: s3Key !== null,
            s3Key,
            note: 'Uploaded in handler (not middleware)'
          });
          
          // Add successful uploads to our list
          if (s3Key) {
            successfulUploads.push(s3Key);
            console.log(`✅ Successfully uploaded in handler: ${file.originalname} → ${s3Key}`);
          } else {
            console.error(`❌ Failed to upload in handler: ${file.originalname}`);
          }
        } catch (error) {
          console.error(`❌ Error uploading file ${file.originalname}:`, error);
          uploadResults.push({
            filename: file.originalname,
            size: file.size,
            success: false,
            error: error.message
          });
        }
      }
    }
    
    console.log(`Upload summary: ${successfulUploads.length} of ${validFiles.length} files uploaded successfully`);
    
    // If no files were uploaded successfully, return an error
    if (successfulUploads.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'All uploads failed',
        message: 'None of the files could be uploaded to S3',
        uploadResults
      });
    }
    
    // Validate the uploaded files using our S3 validation function
    try {
      const { validateAndFilterImageKeys } = await import('./s3-utils');
      const validatedKeys = await validateAndFilterImageKeys(successfulUploads);
      
      console.log(`Validation complete: ${validatedKeys.length} of ${successfulUploads.length} S3 keys are valid`);
      
      // Return the validated file URLs to the client
      return res.status(200).json({
        success: true,
        message: `${validatedKeys.length} files uploaded and validated successfully`,
        files: validatedKeys,
        uploadResults
      });
    } catch (validationError) {
      console.error("Error validating S3 keys:", validationError);
      
      // Return the unvalidated keys if validation fails
      return res.status(200).json({
        success: true,
        message: `${successfulUploads.length} files uploaded successfully (validation skipped)`,
        files: successfulUploads,
        uploadResults,
        validationError: validationError.message
      });
    }
  } catch (error) {
    console.error('Error handling property image upload:', error);
    return res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error during upload'
    });
  }
}