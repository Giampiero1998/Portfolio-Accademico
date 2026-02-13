# ============================================
# 🐳 BACKEND DOCKERFILE - Multi-Stage Build
# Node.js/Express API
# ============================================

# ============================================
# 📦 STAGE 1: Base
# ============================================
FROM node:20-alpine AS base
LABEL maintainer="Scripta Manent Team"
LABEL description="Backend API for Scripta Manent Portfolio"

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copy package files
COPY package*.json ./

# ============================================
# 🛠️ STAGE 2: Development
# ============================================
FROM base AS development
ENV NODE_ENV=development

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]

# ============================================
# 🏗️ STAGE 3: Build (for production)
# ============================================
FROM base AS build
ENV NODE_ENV=production

# Install ALL dependencies first (for build)
RUN npm install

# Copy source code
COPY . .

# Run build scripts if any (optional)
# RUN npm run build

# Remove devDependencies
RUN npm prune --production

# ============================================
# 🚀 STAGE 4: Production
# ============================================
FROM node:20-alpine AS production
ENV NODE_ENV=production

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only production dependencies and built code
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./
COPY --from=build --chown=nodejs:nodejs /app/*.js ./
COPY --from=build --chown=nodejs:nodejs /app/controllers ./controllers
COPY --from=build --chown=nodejs:nodejs /app/models ./models
COPY --from=build --chown=nodejs:nodejs /app/routes ./routes
COPY --from=build --chown=nodejs:nodejs /app/services ./services
COPY --from=build --chown=nodejs:nodejs /app/middleware ./middleware
COPY --from=build --chown=nodejs:nodejs /app/validation ./validation
COPY --from=build --chown=nodejs:nodejs /app/utils ./utils

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start production server
CMD ["npm", "start"]