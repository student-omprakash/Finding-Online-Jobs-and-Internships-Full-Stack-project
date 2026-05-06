# ─── Backend Dockerfile ───────────────────────────────────────────────────────
# Uses node:20-alpine for a small, production-ready image
# ──────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (leverages Docker layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the source code
COPY src/ ./src/

# Create uploads directory (multer needs this)
RUN mkdir -p uploads

# Expose the backend port
EXPOSE 5005

# Health check — Docker will monitor this endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5005/health || exit 1

# Start the server
CMD ["node", "src/index.js"]
