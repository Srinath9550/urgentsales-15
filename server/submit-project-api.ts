import { Request, Response } from "express";
import { db } from "./db";
import { projects } from "../shared/schema";
import { sendEmail } from "./email-service";
import { logActivity, logProjectSubmission } from "./logger-service";

/**
 * Re-export submitProject from projects-service
 * This file is a wrapper to maintain API backward compatibility
 */
export { submitProject } from "./projects-service";

// Just in case we need a dedicated handleProjectSubmission function in the future
// The existing submitProject function already handles everything we need
export async function handleProjectSubmission(req: Request, res: Response) {
  const { submitProject } = await import('./projects-service');
  return submitProject(req, res);
}