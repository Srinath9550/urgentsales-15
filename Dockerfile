FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
ENV PORT=5000
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]