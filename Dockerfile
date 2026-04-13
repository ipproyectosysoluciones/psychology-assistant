# Multi-stage build for Backend - Production
# Stage 1: Dependencies
FROM node:24-alpine AS dependencies

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies (frozen-lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile --production=false

# Stage 2: Build & Runtime
FROM node:24-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy pnpm from dependencies stage
COPY --from=dependencies /usr/local/lib/node_modules/pnpm /usr/local/lib/node_modules/pnpm
RUN ln -s /usr/local/lib/node_modules/pnpm/bin/pnpm.cjs /usr/local/bin/pnpm

# Copy package files
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --production=true

# Copy source code
COPY --chown=nodejs:nodejs . .

# Create logs directory with correct permissions
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Expose port
EXPOSE 5000

# Labels for metadata
LABEL maintainer="Psychology Assistant Team"
LABEL description="Psychology Assistant Backend API"
LABEL version="0.4.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node scripts/healthcheck.js || exit 1

# Run as non-root user
USER nodejs

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Start the application
CMD ["pnpm", "start"]