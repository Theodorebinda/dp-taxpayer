#!/bin/bash
set -e

IMAGE_NAME=dp_web_client
CONTAINER_NAME=dp_web_client
PORT=3000

echo "🛑 Stopping old container..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "🏗️ Building image..."
docker build -t $IMAGE_NAME .

echo "🚀 Running container..."
docker run -d \
  -p $PORT:3000 \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  $IMAGE_NAME

echo "Deployment finished"
