# Stage 1: Build the Angular application
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Environment for low hardware
ENV NG_CLI_ANALYTICS=false
ENV NG_BUILD_MAX_WORKERS=1
ENV NODE_OPTIONS="--max-old-space-size=384"

# Copy package.json and package-lock.json
COPY package*.json .npmrc* ./

# Install dependencies
RUN npm ci --no-audit

# Copy the rest of the application code
COPY . .

# Build the Angular application
ENV NODE_ENV=production
RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:stable-alpine

# Copy built files from builder stage
COPY --from=builder /app/dist/vacuum-cleaner-view/browser /usr/share/nginx/html

# Create Brotli + Gzip in advance (saves CPU at runtime)
RUN apk add --no-cache brotli && \
    for f in $(find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \)); do \
        gzip -9 -k "$f"; \
        brotli -Z  "$f"; \
    done && \
    apk del brotli

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
