#!/bin/bash

docker buildx create --use >/dev/null 2>&1

declare -A SERVICES=(
  ["config-server"]="configserver"
  ["eureka-server"]="eureka"
  ["api-gateway"]="gateway"
  ["user-service"]="userService"
  ["activity-service"]="activityService"
  ["nutrition-service"]="nutritionService"
  ["recommendation-service"]="recommendationService"
  ["frontend"]="Fitness-app-frontend"
)

for IMAGE in "${!SERVICES[@]}"; do
  FOLDER="${SERVICES[$IMAGE]}"
  echo "Building $IMAGE from folder $FOLDER..."
  docker buildx build \
    --platform linux/amd64 \
    -t $IMAGE:latest \
    "./$FOLDER" \
    --load
done

echo "All services built for AMD64."

