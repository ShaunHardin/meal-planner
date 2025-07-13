# Multi-stage build for Vite + React frontend with Express backend
FROM node:18-alpine AS builder

# Install pnpm package manager
RUN npm install -g pnpm

WORKDIR /app

# Copy package files for dependency resolution
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the React frontend into /dist directory
RUN pnpm build

# Production stage - smaller image with only runtime dependencies
FROM node:18-alpine AS production

# Install pnpm for production dependencies
RUN npm install -g pnpm

WORKDIR /app

# Copy package files for production install
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install only production dependencies (no dev tools)
RUN pnpm install --frozen-lockfile --prod

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy Express server file
COPY server.js ./

# Expose port 3001 for the Express server
EXPOSE 3001

# Start the Express server (serves both API and static files)
CMD ["node", "server.js"]