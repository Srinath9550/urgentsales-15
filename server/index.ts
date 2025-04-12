import express, { Request, Response, NextFunction } from "express";
import { Server } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./db";
import { setupAuth } from "./auth";
import { requestLoggerMiddleware } from "./logger-service";
import path from "path";
import fs from "fs-extra";
// Add getAffordableProjects to the import
import { sendEmail } from './db-storage'; 
import { fileURLToPath } from "url";


// Polyfill __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getUpcomingProjects,
  getFeaturedProjects,
  getProjectById,
  getLuxuryProjects,
  getAffordableProjects,
  getNewLaunchProjects,
  getCommercialProjects,
  getNewlyListedProjects,
  getTopUrgentProjects,
  getCompanyProjects,
} from "./projects-service";
// Express is already imported at the top of the file
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Set NODE_ENV to development if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
  console.log('NODE_ENV not set, defaulting to development mode');
}

console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL);

const app = express();
const port = process.env.PORT || 5000;

// Database connection setup
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


pool.connect()
  .then(client => {
    console.log('Connected to the database successfully');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add activity logging middleware
app.use(requestLoggerMiddleware);

// Set up API routes
app.get("/api/projects/upcoming", getUpcomingProjects);
app.get("/api/projects/featured", getFeaturedProjects);
app.get("/api/projects/luxury", getLuxuryProjects);
app.get("/api/projects/affordable", getAffordableProjects);
app.get("/api/projects/new-launch", getNewLaunchProjects);
app.get("/api/projects/commercial", getCommercialProjects);
app.get("/api/projects/newly-listed", getNewlyListedProjects);
app.get("/api/projects/top-urgent", getTopUrgentProjects);
app.get("/api/projects/company", getCompanyProjects);
app.get("/api/projects/:id", getProjectById);

// API Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Try to listen on a specific port, or find an available alternative
 */
async function startServer(app: any, port: number, isProduction: boolean = false): Promise<Server> {
  const maxPortAttempts = 10;
  let currentPort = port;
  let serverStarted = false;
  let server: Server | null = null;

  // Try to start on the specified port, or increment until we find an available one
  for (let attempt = 0; attempt < maxPortAttempts && !serverStarted; attempt++) {
    try {
      server = await new Promise<Server | null>((resolve, reject) => {
        const s = app.listen(currentPort, "0.0.0.0", () => {
          log(`Server running at http://0.0.0.0:${currentPort}`);
          serverStarted = true;
          resolve(s);
        });
        
        s.once('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            log(`Port ${currentPort} is already in use, trying ${currentPort + 1}...`);
            currentPort++;
            resolve(null); // Allow the loop to continue with the next port
          } else {
            reject(err);
          }
        });
      });
      
      if (server) break;
    } catch (error) {
      if (attempt === maxPortAttempts - 1) {
        throw error; // Re-throw if we've exhausted all attempts
      }
    }
  }
  
  if (!serverStarted || !server) {
    throw new Error(`Could not find an available port after ${maxPortAttempts} attempts`);
  }
  
  return server;
}

(async () => {
  try {
    // Initialize database if a connection is available
    if (process.env.DATABASE_URL) {
      await initializeDatabase();
      log("Database initialized successfully", "database");
    }

    // Set up authentication
    setupAuth(app);

    // Ensure "uploads" directory exists
    const uploadsDir = path.join(process.cwd(), "uploads");
    // Use fs-extra's ensureDirSync instead of existsSync/mkdirSync
    fs.ensureDirSync(uploadsDir);
    console.log('Ensured uploads directory exists:', uploadsDir);

    // Serve static files from uploads directory
    app.use("/uploads", express.static(uploadsDir));

    // Register API routes
    await registerRoutes(app);

    // Global Error Handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(`Error: ${message}`);
    });

 // Set up Vite or static serving based on environment
    const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  // ✅ Development: Use Vite dev server
  const server = await startServer(app, port as number);
  await setupVite(app, server);
} else {
  // ✅ Production: Serve built React files
  const clientBuildPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientBuildPath));

  // React Router fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });

  await startServer(app, port as number, true);
}

  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
})();
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Add this test endpoint after your auth routes
app.get('/test-email', async (req, res) => {
  try {
    await sendEmail('admin@example.com', 'SMTP Test', 'This is a test email');
    res.send('Email sent successfully');
  } catch (error) {
    res.status(500).send(`Email failed: ${error instanceof Error ? error.message : error}`);
  }
});
