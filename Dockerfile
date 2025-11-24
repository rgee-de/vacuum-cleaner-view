# Stage 1: Build the Angular application
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Environment for low hardware
ENV NG_CLI_ANALYTICS=false

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci  --ignore-scripts

# Copy Angular workspace files explicitly
COPY angular.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.spec.json ./
COPY .editorconfig ./

# Copy application source
COPY src ./src

# Build the Angular application
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Serve the Angular application with Nginx
FROM nginx:stable-alpine AS runtime

# Copy built Angular files
COPY --from=builder /app/dist/vacuum-cleaner-view/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
