// Test script to check if S3 images are accessible
import dotenv from 'dotenv';
import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_KEY || ''
  }
});

// Bucket name
const bucketName = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';

// Test specific keys
async function testSpecificKeys() {
  console.log('Testing specific S3 keys...');
  
  const testKeys = [
    'properties/1744614622969-952470017.jpg',
    'properties/1744614645930-476073492.jpg',
    'properties/1744614645942-229037486.jpg',
    'properties/1744696075227-385132684.jpeg',
    'properties/1744698986428-974199278.jpg'
  ];
  
  for (const key of testKeys) {
    try {
      console.log(`Testing key: ${key}`);
      
      // Create a GetObject command
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
      });
      
      // Generate a signed URL
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(`✅ Successfully generated signed URL for ${key}`);
      console.log(`   URL: ${signedUrl.substring(0, 100)}...`);
    } catch (error) {
      console.error(`❌ Error accessing key ${key}:`, error.message);
    }
  }
}

// List objects in the properties folder
async function listPropertiesFolder() {
  console.log('\nListing objects in properties folder...');
  
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'properties/',
      MaxKeys: 10
    });
    
    const response = await s3Client.send(command);
    
    if (response.Contents && response.Contents.length > 0) {
      console.log(`✅ Found ${response.Contents.length} objects in properties folder`);
      
      for (const object of response.Contents) {
        console.log(`   - ${object.Key} (${object.Size} bytes)`);
        
        // Generate a signed URL for each object
        const getCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: object.Key
        });
        
        const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
        console.log(`     URL: ${signedUrl.substring(0, 100)}...`);
      }
    } else {
      console.log('❌ No objects found in properties folder');
    }
  } catch (error) {
    console.error('❌ Error listing objects:', error.message);
  }
}

// Run the tests
async function runTests() {
  console.log('S3 Image Access Test');
  console.log('===================');
  console.log(`Bucket: ${bucketName}`);
  console.log(`Region: ${process.env.AWS_BUCKET_REGION || 'ap-south-1'}`);
  console.log('-------------------');
  
  await testSpecificKeys();
  await listPropertiesFolder();
  
  console.log('\nTests completed.');
}

runTests().catch(error => {
  console.error('Error running tests:', error);
});