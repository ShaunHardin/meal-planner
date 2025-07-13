# Multi-stage build for Vite + React frontend with Express backend
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend assets
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install pnpm for production dependencies
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy server file
COPY server.js ./

# Expose port for Express server
EXPOSE 3001

# Start the Express server
CMD ["node", "server.js"]