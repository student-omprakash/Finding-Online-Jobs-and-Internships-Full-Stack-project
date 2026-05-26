#!/bin/bash
# ─── start_jenkins.sh ──────────────────────────────────────────────────────────
# Starts a local Jenkins automation server inside a Docker container.
#
# Mounts:
#   - jenkins_data: persistent volume to store plugins, configurations, and users.
#   - /var/run/docker.sock: grants the Jenkins container access to the host's Docker engine.
#     This allows Jenkins pipelines to build, test, and package Docker containers!
# ──────────────────────────────────────────────────────────────────────────────

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Checking Docker Daemon status..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verify if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
  echo "❌ ERROR: Docker Daemon is not running!"
  echo "🚨 Please start Docker Desktop on your system and try again."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi

echo "✅ Docker Daemon is active."
echo ""
echo "🛠  Building custom Jenkins image with Node.js & Docker pre-installed..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker build -t careernest-jenkins:latest -f Dockerfile.jenkins .
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Custom image 'careernest-jenkins:latest' built successfully."
echo ""

echo "🚀 Starting local Jenkins container on port 8080..."

# Create a volume to persist Jenkins data
docker volume create jenkins_data >/dev/null

# Stop/remove existing Jenkins container if it exists
docker rm -f careernest-jenkins 2>/dev/null || true

# Run Jenkins container in detached mode
# Run as --user root to guarantee full permissions to read/write the mounted docker socket.
docker run -d \
  --name careernest-jenkins \
  --restart unless-stopped \
  --user root \
  -p 8080:8080 \
  -p 50000:50000 \
  -e JAVA_OPTS="-Dhudson.plugins.git.GitSCM.ALLOW_LOCAL_CHECKOUT=true" \
  -v jenkins_data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)":/workspace \
  careernest-jenkins:latest

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Jenkins is starting in the background!"
echo "👉 Open: http://localhost:8080"
echo ""
echo "🔑 To unlock Jenkins, run the following command to get your admin password:"
echo "   docker logs careernest-jenkins"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
