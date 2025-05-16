
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Build the app
RUN npm run build

# Expose port 8080 for the application
EXPOSE 8080

# Start the application using Vite's preview mode to serve the built files
CMD ["npm", "run", "preview"]
