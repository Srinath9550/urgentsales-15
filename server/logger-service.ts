import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Log an activity to the console
 */
export function logActivity({
  userId,
  action,
  entity,
  entityId,
  status,
  details,
  errorMessage,
  ipAddress,
  userAgent
}: {
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  status: 'success' | 'error' | 'pending';
  details?: Record<string, any>;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const timestamp = new Date().toISOString();
    const trackingId = uuidv4();
    
    if (status === 'error') {
      console.error(`[${timestamp}] [ERROR] ${action} - ${entity}${entityId ? ` ID: ${entityId}` : ''} - ${errorMessage || 'No error message'}`);
    } else {
      console.log(`[${timestamp}] [${status.toUpperCase()}] ${action} - ${entity}${entityId ? ` ID: ${entityId}` : ''}`);
    }
    
    // Return a mock result to maintain API compatibility
    return { id: 1, trackingId };
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
}

/**
 * Generate a tracking ID for a user session or request
 */
export function generateTrackingId(): string {
  return uuidv4();
}

/**
 * Middleware to log API requests
 */
export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Assign tracking ID if not exists
  if (!req.headers['x-tracking-id']) {
    const trackingId = generateTrackingId();
    req.headers['x-tracking-id'] = trackingId;
  }
  
  // Capture response
  const originalSend = res.send;
  res.send = function(body: any) {
    const responseTime = Date.now() - startTime;
    
    // Log only for significant endpoints, skip routine calls
    const skipLogging = [
      '/api/user', 
      '/api/properties/featured',
      '/api/recommendations',
      '/api/notifications'
    ].some(path => req.path.startsWith(path) && req.method === 'GET');
    
    if (!skipLogging) {
      // For non-GET requests or important endpoints
      console.log(`[API] ${req.method} ${req.path} - Status: ${res.statusCode} - Time: ${responseTime}ms - User: ${req.user?.id || 'guest'}`);
    }
    
    return originalSend.call(this, body);
  };
  
  next();
}

/**
 * Log project submission attempts
 */
export function logProjectSubmission(req: Request, projectId: number | null, isSuccess: boolean, errorMessage?: string) {
  try {
    const timestamp = new Date().toISOString();
    const details = {
      title: req.body.title || req.body.projectName,
      category: req.body.category,
      location: req.body.location || req.body.projectAddress
    };
    
    if (isSuccess) {
      console.log(`[${timestamp}] [PROJECT SUBMISSION] Success - ID: ${projectId} - ${details.title} (${details.category})`);
    } else {
      console.error(`[${timestamp}] [PROJECT SUBMISSION] Failed - Error: ${errorMessage} - ${details.title} (${details.category})`);
    }
    
    return { success: isSuccess };
  } catch (err) {
    console.error('Failed to log project submission:', err);
    return null;
  }
}

/**
 * Log property submission attempts
 */
export function logPropertySubmission(req: Request, propertyId: number | null, isSuccess: boolean, errorMessage?: string) {
  try {
    const timestamp = new Date().toISOString();
    const details = {
      title: req.body.title,
      propertyType: req.body.propertyType,
      location: req.body.location,
      price: req.body.price
    };
    
    if (isSuccess) {
      console.log(`[${timestamp}] [PROPERTY SUBMISSION] Success - ID: ${propertyId} - ${details.title} (${details.propertyType}) - ₹${details.price}`);
    } else {
      console.error(`[${timestamp}] [PROPERTY SUBMISSION] Failed - Error: ${errorMessage} - ${details.title} (${details.propertyType})`);
    }
    
    return { success: isSuccess };
  } catch (err) {
    console.error('Failed to log property submission:', err);
    return null;
  }
}

/**
 * Log free property submission attempts
 */
export function logFreePropertySubmission(req: Request, propertyId: number | null, isSuccess: boolean, errorMessage?: string) {
  try {
    const timestamp = new Date().toISOString();
    const details = {
      title: req.body.title,
      propertyType: req.body.propertyType,
      location: req.body.location,
      contactEmail: req.body.contactEmail
    };
    
    if (isSuccess) {
      console.log(`[${timestamp}] [FREE PROPERTY SUBMISSION] Success - ID: ${propertyId} - ${details.title} (${details.propertyType}) - Contact: ${details.contactEmail}`);
    } else {
      console.error(`[${timestamp}] [FREE PROPERTY SUBMISSION] Failed - Error: ${errorMessage} - ${details.title} (${details.propertyType}) - Contact: ${details.contactEmail}`);
    }
    
    return { success: isSuccess };
  } catch (err) {
    console.error('Failed to log free property submission:', err);
    return null;
  }
}

/**
 * Mock function to maintain API compatibility
 */
export async function getRecentLogs(limit: number = 100) {
  console.log(`[MOCK] getRecentLogs called with limit: ${limit}`);
  return [];
}

/**
 * Mock function to maintain API compatibility
 */
export async function getEntityLogs(entity: string, entityId: number) {
  console.log(`[MOCK] getEntityLogs called for ${entity} ID: ${entityId}`);
  return [];
}