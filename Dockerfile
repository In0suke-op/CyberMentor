# ====================================================================
# CyberMentor Pro - Universal Multi-Stage Dockerfile
# Optimized for x86_64, ARM64 (Apple Silicon M-series, Raspberry Pi),
# Windows Docker Desktop, and Cloud Container Runtimes
# ====================================================================

# --------------------------------------------------------------------
# Stage 1: Build & Bundle
# --------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies (including devDependencies required for vite & esbuild)
RUN npm install

# Copy application source tree
COPY . .

# Compile Vite frontend SPA and bundle Express backend into dist/server.cjs
RUN npm run build

# --------------------------------------------------------------------
# Stage 2: Minimal Production Runner
# --------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install curl for container health check probes
RUN apk add --no-cache curl

# Copy package manifests for lean runtime install
COPY package*.json ./

# Install only production runtime dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy static frontend build artifacts and bundled server from builder stage
COPY --from=builder /app/dist ./dist

# Use non-root node user for container hardening & least privilege
USER node

# Expose standard port 3000
EXPOSE 3000

# Continuous container health probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Launch the unified server
CMD ["node", "dist/server.cjs"]
