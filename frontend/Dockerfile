# ─── Frontend Dockerfile ──────────────────────────────────────────────────────
# Multi-stage build:
#   Stage 1 (builder): Installs deps & builds the Vite/React app
#   Stage 2 (serve):   Copies the /dist output into an nginx image
# Final image is tiny — only nginx + built static files, no Node.js
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching — only reinstalls if deps change)
COPY package*.json ./

# Install all dependencies (including devDependencies needed for Vite build)
RUN npm install

# Copy the rest of the source
COPY . .

# Accept VITE_API_BASE_URL as a build argument (injected at docker build time)
# Default is the production Render backend URL so the build works even without Render env vars
ARG VITE_API_BASE_URL=https://careernest-backend-r5rj.onrender.com/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the production bundle
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (nginx default)
EXPOSE 80

# nginx runs in the foreground
CMD ["nginx", "-g", "daemon off;"]
