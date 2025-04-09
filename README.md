# Real Estate Platform

A cutting-edge React-based real estate marketplace platform that leverages intelligent technology to simplify property transactions and enhance user engagement.

## Project Structure

This project is built with a modern web application architecture:

- **Frontend**: React with TypeScript, located in the `client` directory
- **Backend**: Express.js API, located in the `server` directory
- **Shared Code**: Common schemas and types shared between frontend and backend, located in the `shared` directory

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start both the backend server and frontend development server with hot reloading.

## Deployment

This application is designed to be deployed in two ways:

### 1. Full-Stack Deployment (Recommended)

This will build both the frontend and backend into a single deployable unit:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### 2. Separate Deployment

You can also deploy the frontend and backend separately:

#### Frontend

Run the build command to generate a static site:

```bash
# From the project root
npm run build
```

The frontend build will be created in `dist/public` directory. You can then deploy this directory to any static hosting service.

#### Backend

The backend is configured to serve the frontend in production mode, but it can also be deployed separately:

```bash
# Set these environment variables for production:
NODE_ENV=production
PORT=your_preferred_port
DATABASE_URL=your_database_connection_string

# Then start the server
node dist/index.js
```

### Deployment with Docker

For containerized deployment, a Dockerfile is provided in the project root:

```bash
# Build the Docker image
docker build -t real-estate-platform .

# Run the container, mapping the port to your host
docker run -p 5000:5000 -e DATABASE_URL=your_database_url -e NODE_ENV=production real-estate-platform
```

### Port Configuration

The application will automatically try to use port 5000, but if that port is already in use, it will incrementally try higher port numbers (5001, 5002, etc.) until it finds an available one. This ensures the application can start even in environments where port conflicts might occur.

## Environment Variables

- `PORT` - Port for the server (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption (set a secure value in production)
- `SITE_URL` - Base URL of the site (used for email links)
- `FORCE_PORT` - Set to "true" to strictly use the specified port and fail if it's not available

## Email Configuration

The application uses Gmail for sending emails. The email credentials are configured to use:

- Email: urgentsale.in@gmail.com

Make sure to maintain these credentials for consistent email delivery.