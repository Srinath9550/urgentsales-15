/**
 * Utility functions for handling image URLs consistently across the application
 */

// Default placeholder image to use when an image fails to load
export const DEFAULT_PLACEHOLDER = "/placeholder-project.jpg";

/**
 * Formats an image URL to ensure it's properly handled by the browser
 * 
 * @param imageUrl The original image URL from the API
 * @returns A properly formatted URL
 */
export function formatImageUrl(imageUrl: string | undefined | null): string {
  // If no URL is provided, return the default placeholder
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.log("No valid image URL provided, using placeholder");
    return DEFAULT_PLACEHOLDER;
  }

  // If it's already an absolute URL (starts with http:// or https://), use it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative URL starting with a slash, prepend the origin
  if (imageUrl.startsWith('/')) {
    // For uploads directory, make sure it's properly formatted
    if (imageUrl.includes('/uploads/')) {
      return imageUrl;
    }
    
    // For other relative URLs, prepend the origin
    return `${window.location.origin}${imageUrl}`;
  }

  // If it's a relative URL without a leading slash, add one
  if (imageUrl.startsWith('uploads/')) {
    return `/${imageUrl}`;
  }

  // For any other format, assume it's a relative path and add a leading slash
  return `/${imageUrl}`;
}

/**
 * Handles image loading errors by providing a fallback
 * 
 * @param event The error event from the img element
 * @param fallbackUrl Optional custom fallback URL
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_PLACEHOLDER
): void {
  const target = event.currentTarget;
  console.log(`Error loading image: ${target.src}`);
  
  // Prevent infinite error loops
  target.onerror = null;
  
  // Try with origin prepended if it's a relative URL
  if (target.src.startsWith('/') && !target.src.startsWith(`${window.location.origin}/`)) {
    const fullUrl = `${window.location.origin}${target.src}`;
    console.log(`Trying with full URL: ${fullUrl}`);
    target.src = fullUrl;
  } else {
    // If that doesn't work, use the fallback
    target.src = fallbackUrl;
  }
}