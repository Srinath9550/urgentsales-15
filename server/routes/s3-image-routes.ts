import { Router, Request, Response } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

const router = Router();

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
});

// Cache for signed URLs to avoid repeated API calls
const signedUrlCache: Record<string, { url: string, expiry: number }> = {};

// Default placeholder SVG for missing images
const placeholderSvg = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#eeeeee"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#999999">Image Not Available</text>
</svg>
`;

// Helper function to extract the actual S3 key from a request
function extractS3Key(keyParam: string): string {
  if (!keyParam) return '';
  
  let extractedKey = keyParam;
  
  // If it's a recursive call (contains our API endpoint), extract the original key
  if (keyParam.includes('/api/s3-image?key=')) {
    try {
      // Extract the key parameter from the URL
      const urlParts = keyParam.split('/api/s3-image?key=');
      if (urlParts.length > 1) {
        extractedKey = decodeURIComponent(urlParts[1]);
        console.log(`Extracted key from URL: ${extractedKey}`);
      }
    } catch (error) {
      console.error("Error extracting original key:", error);
    }
  } else if (keyParam.includes('?key=')) {
    try {
      // Extract the key parameter from a query string
      const queryParts = keyParam.split('?key=');
      if (queryParts.length > 1) {
        extractedKey = decodeURIComponent(queryParts[1]);
        console.log(`Extracted key from query string: ${extractedKey}`);
      }
    } catch (error) {
      console.error("Error extracting key from query string:", error);
    }
  }
  
  // Handle special case for properties folder
  if (extractedKey.includes('properties/') && !extractedKey.startsWith('properties/')) {
    // Extract the properties part
    const parts = extractedKey.split('properties/');
    if (parts.length > 1) {
      extractedKey = `properties/${parts[1]}`;
      console.log(`Extracted properties path: ${extractedKey}`);
    }
  }
  
  // Clean up the key - remove any leading slashes
  return extractedKey.startsWith('/') ? extractedKey.substring(1) : extractedKey;
}

// Endpoint to get a signed URL for an S3 object
router.get("/s3-signed-url", async (req: Request, res: Response) => {
  try {
    const keyParam = req.query.key as string;
    
    console.log(`S3 signed URL request for key: ${keyParam}`);
    
    if (!keyParam) {
      console.log("Missing key parameter in s3-signed-url request");
      return res.status(400).json({
        success: false,
        message: "Missing key parameter"
      });
    }
    
    // Extract the actual S3 key
    const s3Key = extractS3Key(keyParam);
    
    // Check if we have a cached URL that's still valid
    const cached = signedUrlCache[s3Key];
    if (cached && cached.expiry > Date.now()) {
      console.log(`Using cached signed URL for ${s3Key}`);
      return res.json({
        success: true,
        data: {
          signedUrl: cached.url
        }
      });
    }
    
    console.log(`Generating signed URL for key: ${s3Key}`);
    console.log(`Using bucket: ${process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales'}`);
    
    // Generate a signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales',
      Key: s3Key
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log(`Generated signed URL: ${signedUrl.substring(0, 100)}...`);
    
    // Cache the URL with a 50-minute expiry (URLs are valid for 1 hour)
    signedUrlCache[s3Key] = {
      url: signedUrl,
      expiry: Date.now() + 50 * 60 * 1000 // 50 minutes in milliseconds
    };
    
    return res.json({
      success: true,
      data: {
        signedUrl
      }
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate signed URL"
    });
  }
});

// Project placeholder SVG for pending uploads
const projectPlaceholderSvg = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f0f9ff"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#666666">Project Image</text>
</svg>
`;

// Endpoint to redirect to a signed URL for an S3 image
router.get("/s3-image", async (req: Request, res: Response) => {
  try {
    const keyParam = req.query.key as string;
    const isProject = req.query.type === 'project';
    
    console.log(`S3 image request for key: ${keyParam}`);
    
    if (!keyParam) {
      console.log("Missing key parameter in s3-image request");
      return res.type('image/svg+xml').send(isProject ? projectPlaceholderSvg : placeholderSvg);
    }
    
    // Special case for "pending-upload" placeholder
    if (keyParam === 'pending-upload' || keyParam.includes('blob:')) {
      console.log("Handling pending-upload or blob URL placeholder");
      return res.type('image/svg+xml').send(isProject ? projectPlaceholderSvg : placeholderSvg);
    }
    
    // Check if the key is already a full URL (might be a redirect loop)
    if (keyParam.startsWith('http://') || keyParam.startsWith('https://')) {
      console.log(`Key is already a full URL, redirecting directly: ${keyParam.substring(0, 100)}...`);
      return res.redirect(keyParam);
    }
    
    // Extract the actual S3 key
    const s3Key = extractS3Key(keyParam);
    console.log(`Extracted S3 key: ${s3Key}`);
    
    if (!s3Key) {
      console.log("Invalid key parameter in s3-image request");
      return res.type('image/svg+xml').send(isProject ? projectPlaceholderSvg : placeholderSvg);
    }
    
    // Special case for "pending-upload" placeholder (after extraction)
    if (s3Key === 'pending-upload') {
      console.log("Handling pending-upload placeholder (after extraction)");
      return res.type('image/svg+xml').send(isProject ? projectPlaceholderSvg : placeholderSvg);
    }
    
    // Check if the extracted key is already a full URL
    if (s3Key.startsWith('http://') || s3Key.startsWith('https://')) {
      console.log(`Extracted key is already a full URL, redirecting directly: ${s3Key.substring(0, 100)}...`);
      return res.redirect(s3Key);
    }
    
    // Check if the key still contains our API endpoint (recursive loop)
    if (s3Key.includes('/api/s3-image')) {
      console.log("Detected potential recursive loop in S3 key");
      return res.type('image/svg+xml').send(isProject ? projectPlaceholderSvg : placeholderSvg);
    }
    
    // Check if we have a cached URL that's still valid
    const cached = signedUrlCache[s3Key];
    if (cached && cached.expiry > Date.now()) {
      console.log(`Using cached signed URL for ${s3Key}`);
      return res.redirect(cached.url);
    }
    
    // Special handling for properties folder
    if (s3Key.includes('properties/')) {
      console.log(`Detected properties folder image: ${s3Key}`);
      
      try {
        // First try to generate a signed URL
        console.log(`Generating signed URL for properties key: ${s3Key}`);
        console.log(`Using bucket: ${process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales'}`);
        
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales',
          Key: s3Key
        });
        
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log(`Generated signed URL for properties: ${signedUrl.substring(0, 100)}...`);
        
        // Cache the URL with a 50-minute expiry (URLs are valid for 1 hour)
        signedUrlCache[s3Key] = {
          url: signedUrl,
          expiry: Date.now() + 50 * 60 * 1000 // 50 minutes in milliseconds
        };
        
        // Redirect to the signed URL
        return res.redirect(signedUrl);
      } catch (error) {
        console.error(`Error generating signed URL for properties image ${s3Key}:`, error);
        
        // Try direct S3 URL as fallback
        const bucketName = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';
        const region = process.env.AWS_BUCKET_REGION || 'ap-south-1';
        const directS3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
        
        console.log(`Falling back to direct S3 URL: ${directS3Url}`);
        return res.redirect(directS3Url);
      }
    }
    
    console.log(`Generating signed URL for key: ${s3Key}`);
    console.log(`Using bucket: ${process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales'}`);
    
    try {
      // Generate a signed URL
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales',
        Key: s3Key
      });
      
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(`Generated signed URL: ${signedUrl.substring(0, 100)}...`);
      
      // Cache the URL with a 50-minute expiry (URLs are valid for 1 hour)
      signedUrlCache[s3Key] = {
        url: signedUrl,
        expiry: Date.now() + 50 * 60 * 1000 // 50 minutes in milliseconds
      };
      
      // Redirect to the signed URL
      return res.redirect(signedUrl);
    } catch (error) {
      console.error(`Error generating signed URL for image ${s3Key}:`, error);
      
      // Try direct S3 URL as fallback
      const bucketName = process.env.AWS_BUCKET_NAME || 'property-images-urgent-sales';
      const region = process.env.AWS_BUCKET_REGION || 'ap-south-1';
      const directS3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
      
      console.log(`Falling back to direct S3 URL: ${directS3Url}`);
      
      try {
        return res.redirect(directS3Url);
      } catch (redirectError) {
        console.error("Error redirecting to direct S3 URL:", redirectError);
        return res.type('image/svg+xml').send(isProject ? projectPlaceholderSvg : placeholderSvg);
      }
    }
  } catch (error) {
    console.error("Error generating signed URL for image:", error);
    const isProject = req.query.type === 'project';
    return res.type('image/svg+xml').send(isProject ? projectPlaceholderSvg : placeholderSvg);
  }
});

export default router;