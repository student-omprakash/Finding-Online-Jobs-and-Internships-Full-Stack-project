#!/bin/bash
# ─── start_jenkins.sh ──────────────────────────────────────────────────────────
# Starts a local Jenkins automation server inside a Docker container.
#
# Mounts:
#   - jenkins_home: persistent volume to store plugins, configurations, and users.
#   - /var/run/docker.sock: grants the Jenkins container access to the host's Docker engine.
#     This allows Jenkins pipelines to build, test, and package Docker containers!
# ──────────────────────────────────────────────────────────────────────────────

echo "🚀 Starting local Jenkins container on port 8080..."

# Create a volume to persist Jenkins data
docker volume create jenkins_data

# Stop/remove existing Jenkins container if it exists
docker rm -f careernest-jenkins 2>/dev/null || true

# Run Jenkins container in detached mode
docker run -d \
  --name careernest-jenkins \
  --restart unless-stopped \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)":/workspace \
  jenkins/jenkins:lts

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Jenkins is starting in the background!"
echo "👉 Open: http://localhost:8080"
echo ""
echo "🔑 To unlock Jenkins, run the following command to get your admin password:"
echo "   docker logs careernest-jenkins"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
