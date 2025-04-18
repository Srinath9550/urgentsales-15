/**
 * Utility functions for handling image URLs consistently across the application
 * 
 * This module provides functions for formatting image URLs from various sources,
 * including S3 bucket URLs, and handling image loading errors.
 */

// Default placeholder image to use when an image fails to load
// Use an inline SVG as the default placeholder to avoid path issues
export const DEFAULT_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";

// Project-specific placeholder
export const PROJECT_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjlmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiPlByb2plY3QgSW1hZ2U8L3RleHQ+PC9zdmc+";

/**
 * Formats an image URL to ensure it's properly handled by the browser
 * 
 * @param imageUrl The original image URL from the API
 * @param isProject Optional flag to indicate if this is a project image (uses different placeholder)
 * @returns A properly formatted URL
 */
// Cache for pre-signed URLs to avoid repeated API calls
const signedUrlCache: Record<string, { url: string, expiry: number }> = {};

// Function to get a pre-signed URL from the server
async function getSignedUrl(key: string): Promise<string> {
  try {
    // Skip empty keys
    if (!key || key.trim() === '') {
      console.log('Empty key provided to getSignedUrl');
      return DEFAULT_PLACEHOLDER;
    }
    
    // Clean up the key - remove any leading/trailing whitespace
    const cleanKey = key.trim();
    
    // Check if we have a cached URL that's still valid
    const cached = signedUrlCache[cleanKey];
    if (cached && cached.expiry > Date.now()) {
      console.log(`Using cached signed URL for ${cleanKey}`);
      return cached.url;
    }

    // Make API call to get a pre-signed URL
    console.log(`Fetching signed URL for key: ${cleanKey}`);
    const response = await fetch(`/api/s3-signed-url?key=${encodeURIComponent(cleanKey)}`);
    
    // Parse the response JSON
    const data = await response.json();
    
    // Check for various error conditions
    if (!response.ok) {
      console.error(`Failed to get signed URL: ${response.status} ${response.statusText}`);
      console.error('Error response:', data);
      return DEFAULT_PLACEHOLDER;
    }

    if (!data.success) {
      console.error('Server reported failure for signed URL request:', data.message);
      return DEFAULT_PLACEHOLDER;
    }
    
    if (!data.data || !data.data.signedUrl) {
      console.error('Invalid response from signed URL endpoint (missing data or signedUrl):', data);
      return DEFAULT_PLACEHOLDER;
    }
    
    // If the server returned an empty signedUrl, it means the object doesn't exist
    if (data.data.signedUrl === '') {
      console.error('Server returned empty signed URL, object may not exist:', cleanKey);
      return DEFAULT_PLACEHOLDER;
    }

    // Cache the URL with a 50-minute expiry (URLs are valid for 1 hour)
    const signedUrl = data.data.signedUrl;
    signedUrlCache[cleanKey] = {
      url: signedUrl,
      expiry: Date.now() + 50 * 60 * 1000 // 50 minutes in milliseconds
    };

    console.log(`Got new signed URL for ${cleanKey}: ${signedUrl.substring(0, 100)}...`);
    return signedUrl;
  } catch (error) {
    console.error(`Error getting signed URL for ${key}:`, error);
    return DEFAULT_PLACEHOLDER;
  }
}

export async function formatImageUrlAsync(imageUrl: string | undefined | null): Promise<string> {
  // If no URL is provided, return the default placeholder
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.log("No valid image URL provided, using placeholder");
    return DEFAULT_PLACEHOLDER;
  }

  try {
    console.log(`formatImageUrlAsync processing: ${imageUrl}`);
    
    // Clean up the URL - remove any curly braces that might be in the database
    let cleanUrl = imageUrl.trim();
    if (cleanUrl.startsWith('{') && cleanUrl.endsWith('}')) {
      cleanUrl = cleanUrl.substring(1, cleanUrl.length - 1);
      console.log(`Removed curly braces from URL: ${imageUrl} -> ${cleanUrl}`);
    }
    
    // CASE 1: If it's already a data URL (inline SVG or base64), use it directly
    if (cleanUrl.startsWith('data:')) {
      console.log("Using data URL directly");
      return cleanUrl;
    }
    
    // CASE 2: If it's already an absolute URL (not S3), use it directly
    if (cleanUrl.startsWith('http') && !cleanUrl.includes('amazonaws.com')) {
      console.log("Using absolute URL directly:", cleanUrl);
      return cleanUrl;
    }
    
    // CASE 3: If it's an S3 URL (contains amazonaws.com), ensure it has https:// prefix
    if (cleanUrl.includes('amazonaws.com')) {
      const s3Url = cleanUrl.startsWith('https://') ? cleanUrl : `https://${cleanUrl}`;
      console.log("Formatted S3 URL:", s3Url);
      return s3Url;
    }
    
    // For all other cases, use the API endpoint to get a signed URL
    console.log("Using API endpoint for S3 image:", cleanUrl);
    return `/api/s3-image?key=${encodeURIComponent(cleanUrl)}`;
  } catch (error) {
    console.error("Error in formatImageUrlAsync:", error);
    return DEFAULT_PLACEHOLDER;
  }
}

// Synchronous version for backward compatibility
/**
 * Processes an array of image URLs to ensure they're all in the correct format
 * @param urls Array of image URLs to process
 * @returns Array of properly formatted URLs
 */
export function processImageUrls(urls?: string[]): string[] {
  if (!urls || !Array.isArray(urls)) {
    console.log("Invalid image URLs array:", urls);
    return [DEFAULT_PLACEHOLDER];
  }
  
  // Filter out any invalid URLs (empty strings, undefined, etc.)
  const validUrls = urls.filter(url => url && typeof url === 'string' && url.trim() !== '');
  
  if (validUrls.length === 0) {
    console.log("No valid image URLs found in:", urls);
    return [DEFAULT_PLACEHOLDER];
  }
  
  // Process each URL - use the API endpoint for S3 images
  const processedUrls = validUrls.map(url => {
    // If it's already a full URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, use the API endpoint
    return `/api/s3-image?key=${encodeURIComponent(url)}`;
  });
  
  return processedUrls;
}

export function formatImageUrl(imageUrl: string | undefined | null, isProject: boolean = false): string {
  // If no URL is provided, return the appropriate placeholder
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.log("No valid image URL provided, using placeholder");
    return isProject ? PROJECT_PLACEHOLDER : DEFAULT_PLACEHOLDER;
  }
  
  // Log the original URL for debugging
  console.log("Formatting image URL:", imageUrl);

  // Special handling for "pending-upload" placeholder and blob URLs
  if (imageUrl === "pending-upload" || (typeof imageUrl === 'string' && imageUrl.startsWith('blob:'))) {
    console.log("Handling 'pending-upload' or blob URL placeholder");
    // Use the API endpoint with a special parameter to indicate it's a pending upload
    return `/api/s3-image?key=pending-upload${isProject ? '&type=project' : ''}`;
  }

  // Log the original URL for debugging
  console.log("Formatting image URL:", imageUrl);

  try {
    // Clean up the URL - remove any curly braces that might be in the database
    let cleanUrl = imageUrl.trim();
    if (cleanUrl.startsWith('{') && cleanUrl.endsWith('}')) {
      cleanUrl = cleanUrl.substring(1, cleanUrl.length - 1);
      console.log(`Removed curly braces from URL: ${imageUrl} -> ${cleanUrl}`);
    }
    
    // CASE 1: If it's already a data URL (inline SVG or base64), use it directly
    if (cleanUrl.startsWith('data:')) {
      console.log("Using data URL directly");
      return cleanUrl;
    }
    
    // CASE 2: If it's already an absolute URL (starts with http:// or https://), use it as is
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      console.log("Using absolute URL as is:", cleanUrl);
      return cleanUrl;
    }

    // CASE 3: If it's an S3 URL (contains amazonaws.com), ensure it has https:// prefix
    if (cleanUrl.includes('amazonaws.com')) {
      const s3Url = cleanUrl.startsWith('https://') ? cleanUrl : `https://${cleanUrl}`;
      console.log("Formatted S3 URL:", s3Url);
      return s3Url;
    }

    // CASE 4: If it's a project image with a specific format (e.g., projects/123.jpg)
    if (isProject && (cleanUrl.startsWith('projects/') || cleanUrl.includes('/projects/'))) {
      console.log("Using API endpoint for project S3 image:", cleanUrl);
      return `/api/s3-image?key=${encodeURIComponent(cleanUrl)}&type=project`;
    }

    // For all other cases, use the API endpoint to get a signed URL
    console.log("Using API endpoint for S3 image:", cleanUrl);
    return `/api/s3-image?key=${encodeURIComponent(cleanUrl)}${isProject ? '&type=project' : ''}`;
  } catch (error) {
    console.error("Error formatting image URL:", error);
    return isProject ? PROJECT_PLACEHOLDER : DEFAULT_PLACEHOLDER;
  }
}

/**
 * Handles image loading errors by providing a fallback
 * 
 * @param event The error event from the img element
 * @param fallbackUrl Optional custom fallback URL
 * @param isProject Optional flag to indicate if this is a project image
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_PLACEHOLDER,
  isProject: boolean = false
): void {
  const target = event.currentTarget;
  console.log(`Error loading image: ${target.src}`);
  
  // Prevent infinite error loops
  target.onerror = null;
  
  // Use the appropriate default fallback if none is provided
  const defaultFallback = isProject ? PROJECT_PLACEHOLDER : DEFAULT_PLACEHOLDER;
  const finalFallback = fallbackUrl || defaultFallback;
  
  // Check if the original source was a pending-upload placeholder
  const isPendingUpload = target.src.includes('pending-upload');
  if (isPendingUpload) {
    console.log("Handling error for pending-upload placeholder");
    target.src = finalFallback;
    return;
  }
  
  try {
    // SPECIAL CASE: If it's the placeholder image that failed, use the inline SVG fallback
    if (target.src.includes('placeholder-property.jpg') || target.src.includes('placeholder-project.jpg')) {
      console.log(`Placeholder image failed, using hardcoded fallback`);
      target.src = finalFallback;
      return;
    }
    
    // Extract the original image path/key from the URL
    let originalPath = target.src;
    
    // Remove protocol and domain if present
    if (originalPath.includes('://')) {
      originalPath = originalPath.split('://')[1];
      if (originalPath.includes('/')) {
        originalPath = originalPath.substring(originalPath.indexOf('/') + 1);
      }
    }
    
    console.log(`Extracted original path: ${originalPath}`);
    
    // ATTEMPT 1: Check if the original path has curly braces and try to fix it
    if (originalPath.startsWith('{') && originalPath.endsWith('}')) {
      // Clean up the path - remove curly braces
      const cleanPath = originalPath.substring(1, originalPath.length - 1);
      console.log(`Removed curly braces from path: ${originalPath} -> ${cleanPath}`);
      
      // Construct the full S3 URL
      const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME || 'property-images-urgent-sales';
      const region = import.meta.env.VITE_AWS_BUCKET_REGION || 'ap-south-1';
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${cleanPath}`;
      
      console.log(`Trying with constructed S3 URL: ${s3Url}`);
      target.src = s3Url;
      return;
    }
    
    // ATTEMPT 2: Try to use our API endpoint
    // Clean up the key - remove any leading slashes
    const key = originalPath.startsWith('/') ? originalPath.substring(1) : originalPath;
    
    // Check if this is a project image path
    const isProjectPath = key.includes('projects/') || key.includes('/projects/');
    
    // Use our API endpoint
    const apiUrl = `/api/s3-image?key=${encodeURIComponent(key)}`;
    
    console.log(`Trying with API endpoint: ${apiUrl}`);
    target.src = apiUrl;
    return;
    
    // ATTEMPT 3: For project images, try a specific approach
    if (isProject || isProjectPath) {
      // Clean up the key - remove any leading slashes
      const projectKey = key.startsWith('/') ? key.substring(1) : key;
      
      // Use our API endpoint with project-specific handling
      const projectApiUrl = `/api/s3-image?key=${encodeURIComponent(projectKey)}&type=project`;
      
      console.log(`Trying with API endpoint for project: ${projectApiUrl}`);
      target.src = projectApiUrl;
      return;
    }
    
    // ATTEMPT 4: For property images, try a specific approach
    if (originalPath.includes('properties/user-')) {
      // Clean up the key - remove any leading slashes
      const propertyKey = originalPath.startsWith('/') ? originalPath.substring(1) : originalPath;
      
      // Use our API endpoint
      const propertyApiUrl = `/api/s3-image?key=${encodeURIComponent(propertyKey)}`;
      
      console.log(`Trying with API endpoint for user property: ${propertyApiUrl}`);
      target.src = propertyApiUrl;
      return;
    }
    
    // ATTEMPT 5: For S3 URLs, try to get a pre-signed URL
    if (target.src.includes('amazonaws.com') || 
        (originalPath.includes('/') && !originalPath.startsWith('/') && !originalPath.includes(':')) ||
        originalPath.match(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/)) {
      
      // Extract the key from the URL
      let s3Key = originalPath;
      if (target.src.includes('amazonaws.com')) {
        const parts = target.src.split('amazonaws.com/');
        if (parts.length > 1) {
          s3Key = parts[1];
        }
      }
      
      // Clean up the key - remove any leading slashes
      s3Key = s3Key.startsWith('/') ? s3Key.substring(1) : s3Key;
      
      console.log(`Trying to get pre-signed URL for key: ${s3Key}`);
      
      // Set a temporary placeholder while we fetch the signed URL
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
      
      // Fetch the pre-signed URL asynchronously
      getSignedUrl(s3Key)
        .then(signedUrl => {
          console.log(`Got pre-signed URL: ${signedUrl}`);
          target.src = signedUrl;
        }) 
        .catch(error => {
          console.error(`Failed to get pre-signed URL for ${s3Key}:`, error);
          // Use appropriate fallback
          target.src = finalFallback;
        });
      
      return;
    }
    
    // If all attempts fail, use the appropriate fallback
    console.log(`All attempts failed, using fallback`);
    target.src = finalFallback;
  } catch (error) {
    console.error("Error in handleImageError:", error);
    // If all attempts fail, use the appropriate fallback
    console.log(`Error handling image, using fallback`);
    target.src = finalFallback;
  }
}