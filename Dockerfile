
# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Runtime Stage
FROM node:18-alpine AS runtime

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy built files from previous stage
COPY --from=build /app/dist ./dist

# Expose the port the app will run on
EXPOSE 8080

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "8080"]
