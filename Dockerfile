# Backend - Production Image
FROM node:24-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --frozen-lockfile --production=true --ignore-scripts

# Install tsx as a regular dependency (for running TypeScript directly)
RUN pnpm add tsx

# Copy source code
COPY --chown=nodejs:nodejs . .

# Expose port
EXPOSE 5000

# Labels
LABEL maintainer="Psychology Assistant Team"
LABEL description="Psychology Assistant Backend API"
LABEL version="0.5.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node scripts/healthcheck.js || exit 1

# Run as non-root user
USER nodejs

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the application with tsx (runs TypeScript directly)
CMD ["npx", "tsx", "src/server.ts"]
