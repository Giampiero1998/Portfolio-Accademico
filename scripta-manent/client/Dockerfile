# ============================================
# 🐳 FRONTEND DOCKERFILE - Multi-Stage Build
# React/Vite Application
# ============================================

# ============================================
# 📦 STAGE 1: Base
# ============================================
FROM node:20-alpine AS base
LABEL maintainer="Scripta Manent Team"
LABEL description="Frontend for Scripta Manent Portfolio"

WORKDIR /app

# Copy package files
COPY package*.json ./

# ============================================
# 🛠️ STAGE 2: Development
# ============================================
FROM base AS development
ENV NODE_ENV=development

# Install ALL dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================
# 🏗️ STAGE 3: Build
# ============================================
FROM base AS build
ENV NODE_ENV=production

# Build args for environment variables
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Install ALL dependencies (for build)
RUN npm install

# Copy source code
COPY . .

# Build for production
RUN npm run build

# ============================================
# 🚀 STAGE 4: Production (with Nginx)
# ============================================
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Touch nginx.pid and set ownership
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 5173 (to match dev port)
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]