
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy all other files and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Create custom nginx configuration for port 3000
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3000 for the application
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
