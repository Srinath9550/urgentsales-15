import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config();

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// Test listing objects in the bucket
async function listObjects() {
  try {
    console.log("Listing objects in bucket:", process.env.AWS_BUCKET_NAME);
    
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      MaxKeys: 10,
      Prefix: "properties/"
    });
    
    const response = await s3Client.send(command);
    
    console.log("S3 List Objects Response:");
    console.log("Total objects:", response.KeyCount);
    
    if (response.Contents && response.Contents.length > 0) {
      console.log("First 10 objects:");
      response.Contents.forEach((item, index) => {
        console.log(`${index + 1}. ${item.Key} (${item.Size} bytes)`);
      });
      
      // Get a signed URL for the first object
      if (response.Contents[0]) {
        const key = response.Contents[0].Key;
        await getObjectSignedUrl(key);
      }
    } else {
      console.log("No objects found with prefix 'properties/'");
    }
  } catch (error) {
    console.error("Error listing objects:", error);
  }
}

// Test getting a signed URL for an object
async function getObjectSignedUrl(key) {
  try {
    console.log(`\nGetting signed URL for object: ${key}`);
    
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    console.log("Signed URL:", signedUrl);
    
    // Construct the direct S3 URL
    const directUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
    console.log("Direct S3 URL:", directUrl);
    
    return signedUrl;
  } catch (error) {
    console.error(`Error getting signed URL for ${key}:`, error);
    return null;
  }
}

// Run the tests
(async () => {
  await listObjects();
})();