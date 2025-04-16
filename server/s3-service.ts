import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
});

export async function uploadToS3(file: Express.Multer.File, folder: string): Promise<string | null> {
  // Validate file before uploading
  if (!file) {
    console.warn(`Skipping upload for null file`);
    return null;
  }
  
  // Log file details for debugging
  console.log(`File details for upload:`, {
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    hasBuffer: !!file.buffer,
    bufferLength: file.buffer ? file.buffer.length : 0
  });
  
  // Check file size but don't check for buffer - some implementations may use streams
  if (file.size === 0) {
    console.warn(`Skipping upload for empty file: ${file.originalname} (0 bytes)`);
    return null;
  }
  
  // Generate a unique filename with timestamp and random number to prevent collisions
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000000);
  const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
  const key = `${folder}/${timestamp}-${randomId}.${sanitizedFilename.split('.').pop() || 'jpg'}`;
  
  console.log(`Uploading file: ${file.originalname} (${file.size} bytes) to S3 key: ${key}`);
  
  try {
    // Ensure we have a valid bucket name
    const bucketName = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';
    console.log(`Using S3 bucket: ${bucketName}`);
    
    // Check if we have a buffer
    if (!file.buffer) {
      console.error(`Missing buffer for file: ${file.originalname}`);
      
      // If we have a path property, try to read the file from disk
      if (file.path) {
        console.log(`Attempting to read file from path: ${file.path}`);
        try {
          const fs = await import('fs');
          const fileContent = await fs.promises.readFile(file.path);
          file.buffer = fileContent;
          console.log(`Successfully read file from disk: ${file.path} (${fileContent.length} bytes)`);
        } catch (readError) {
          console.error(`Failed to read file from path: ${file.path}`, readError);
          return null;
        }
      } else {
        return null;
      }
    }
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size
    });

    // Send the command and get the result
    const result = await s3Client.send(command);
    
    // Log the result for debugging
    console.log(`✅ S3 upload result:`, {
      key,
      fileSize: file.size,
      statusCode: result.$metadata?.httpStatusCode,
      requestId: result.$metadata?.requestId
    });
    
    // Check if the upload was successful (S3 returns 200 for success)
    if (result.$metadata?.httpStatusCode === 200) {
      console.log(`✅ Successfully uploaded file to S3: ${key} (${file.size} bytes)`);
      return key;
    } else {
      console.warn(`⚠️ S3 upload returned non-200 status: ${result.$metadata?.httpStatusCode}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Failed to upload file to S3: ${file.originalname}`, error);
    return null;
  }
}

export async function getSignedImageUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    // Validate input
    if (!key || typeof key !== 'string' || key.trim() === '') {
      console.error('Invalid key provided to getSignedImageUrl:', key);
      return '';
    }
    
    // Special case for "pending-upload" placeholder and blob URLs
    if (key === 'pending-upload' || (typeof key === 'string' && key.startsWith('blob:'))) {
      console.log('Handling pending-upload or blob URL placeholder in getSignedImageUrl');
      return '';
    }
    
    // Clean up the key - remove any leading slashes or URL components
    let cleanKey = key.trim();
    
    // If it's a full URL, extract just the path part
    if (cleanKey.includes('amazonaws.com')) {
      const urlParts = cleanKey.split('amazonaws.com/');
      if (urlParts.length > 1) {
        cleanKey = urlParts[1];
      }
    } else if (cleanKey.startsWith('http')) {
      // For other URLs, try to extract the path
      try {
        const url = new URL(cleanKey);
        cleanKey = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
      } catch (e) {
        console.error('Error parsing URL:', e);
      }
    }
    
    // Remove any leading slash
    cleanKey = cleanKey.startsWith('/') ? cleanKey.substring(1) : cleanKey;
    
    // Validate that we have a valid key after cleaning
    if (!cleanKey || cleanKey.trim() === '') {
      console.error('Invalid key after cleaning:', key);
      return '';
    }
    
    console.log(`Getting signed URL for key: ${cleanKey}`);
    
    // Check if AWS credentials are configured
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY) {
      console.error('AWS credentials not configured properly');
      return '';
    }
    
    // Ensure bucket name is defined
    const bucketName = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';
    
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: cleanKey
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    console.log(`Generated signed URL: ${signedUrl}`);
    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for key ${key}:`, error);
    
    // If we can't generate a signed URL, try to return a direct S3 URL as fallback
    try {
      if (key && typeof key === 'string' && key.trim() !== '' && key !== 'pending-upload') {
        // Clean the key
        let cleanKey = key.trim();
        if (cleanKey.includes('amazonaws.com')) {
          const urlParts = cleanKey.split('amazonaws.com/');
          if (urlParts.length > 1) {
            cleanKey = urlParts[1];
          }
        }
        cleanKey = cleanKey.startsWith('/') ? cleanKey.substring(1) : cleanKey;
        
        // Generate direct URL
        const bucketName = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';
        const region = process.env.AWS_BUCKET_REGION || 'ap-south-1';
        const directUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${cleanKey}`;
        console.log(`Falling back to direct S3 URL: ${directUrl}`);
        return directUrl;
      }
    } catch (fallbackError) {
      console.error('Error generating fallback URL:', fallbackError);
    }
    
    return '';
  }
}