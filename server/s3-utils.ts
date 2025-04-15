import { S3Client, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || 'ap-south-1',
  credentials: process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  } : undefined
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';

/**
 * Validates and filters S3 image keys
 * - Removes duplicates
 * - Checks if files exist in S3
 * - Optionally removes 0-byte files
 * 
 * @param imageKeys Array of S3 keys to validate
 * @param deleteEmptyFiles Whether to delete 0-byte files (default: true)
 * @returns Array of valid, unique S3 keys
 */
export async function validateAndFilterImageKeys(imageKeys: string[], deleteEmptyFiles = true): Promise<string[]> {
  // Skip validation if no keys provided
  if (!imageKeys || !Array.isArray(imageKeys) || imageKeys.length === 0) {
    console.log('No image keys to validate');
    return [];
  }

  console.log(`Validating ${imageKeys.length} S3 image keys`);
  
  // Use a Set to automatically remove duplicates
  const seen = new Set<string>();
  const validKeys: string[] = [];
  const invalidKeys: string[] = [];
  
  // Process each key
  for (const key of imageKeys) {
    // Skip empty keys or already processed keys
    if (!key || typeof key !== 'string' || seen.has(key)) {
      continue;
    }
    
    seen.add(key);
    
    try {
      // Check if the file exists and has content
      const headCommand = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      });
      
      const headResponse = await s3Client.send(headCommand);
      
      // Check if file has content
      if (headResponse.ContentLength && headResponse.ContentLength > 0) {
        validKeys.push(key);
        console.log(`✅ Valid file: ${key} (${headResponse.ContentLength} bytes)`);
      } else {
        invalidKeys.push(key);
        console.warn(`⚠️ Empty file detected: ${key} (0 bytes)`);
        
        // Optionally delete empty files
        if (deleteEmptyFiles) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key
            });
            
            await s3Client.send(deleteCommand);
            console.log(`🗑️ Deleted 0-byte file: ${key}`);
          } catch (deleteError) {
            console.error(`Failed to delete empty file ${key}:`, deleteError);
          }
        }
      }
    } catch (error) {
      invalidKeys.push(key);
      console.warn(`❌ Invalid or missing file: ${key}`, error);
    }
  }
  
  // Log summary
  console.log(`S3 validation complete: ${validKeys.length} valid, ${invalidKeys.length} invalid/empty files`);
  
  return validKeys;
}