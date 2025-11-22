# Stage 1: Build the Angular application
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Environment for low hardware
ENV NG_CLI_ANALYTICS=false

# Copy package.json and package-lock.json
COPY package*.json .npmrc* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular application
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Serve the Angular application with Nginx
FROM nginx:stable-alpine AS runtime

# Install brotli + gzip in one layer (smallest footprint)
RUN apk add --no-cache brotli gzip

# Copy built files from builder stage
COPY --from=builder /app/dist/vacuum-cleaner-view/browser /usr/share/nginx/html

# Create Brotli + Gzip in advance (saves CPU at runtime)
# Precompress BSP (Brotli & Gzip)
RUN find /usr/share/nginx/html \
    -type f \
    \( -name "*.js" -o -name "*.css" -o -name "*.html" \) \
    -exec gzip -9 -k {} \; \
    -exec brotli --force --quality=11 {} \;

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
