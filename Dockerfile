# ---------- Build Stage ----------
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies with cache optimization
COPY package*.json ./
RUN npm ci

# Copy app source and build it
COPY . .
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

# Remove default nginx config if it exists
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config to serve on port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose custom port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
