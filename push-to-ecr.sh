#!/bin/bash

set -e

AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="049706517419"
ECR="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

echo "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR

# Local images you built
LOCAL_IMAGES=(
  config-server
  eureka-server
  api-gateway
  user-service
  activity-service
  nutrition-service
  recommendation-service
  frontend
)

# External images to pull + retag
declare -A EXTERNAL_IMAGES=(
  ["mysql"]="mysql:8.0"
  ["mongodb"]="mongo:6"
  ["rabbitmq"]="rabbitmq:3.13-management"
  ["keycloak-postgres"]="postgres:15"
  ["keycloak"]="quay.io/keycloak/keycloak:21.1.1"
)

echo "Pushing local images..."
for IMG in "${LOCAL_IMAGES[@]}"; do
  docker tag $IMG:latest $ECR/$IMG:latest
  docker push $ECR/$IMG:latest
done

echo "Pushing external images..."
for NAME in "${!EXTERNAL_IMAGES[@]}"; do
  SRC="${EXTERNAL_IMAGES[$NAME]}"
  docker pull $SRC
  docker tag $SRC $ECR/$NAME:latest
  docker push $ECR/$NAME:latest
done
echo "Pushing external images (AMD64 only)..." 
for NAME in "${!EXTERNAL_IMAGES[@]}"; do 
SRC="${EXTERNAL_IMAGES[$NAME]}"

# Force AMD64 pull
docker pull --platform linux/amd64 $SRC

# Validate architecture 
ARCH=$(docker inspect $SRC | jq -r '.[].Architecture')
if [[ "$ARCH" != "amd64" ]]; then 
echo " ERROR: $SRC is not AMD64 (detected: $ARCH). Skipping push." 
	continue 
fi
echo " Architecture verified: $ARCH"

# Tag + push to ECR 
docker tag $SRC $ECR/$NAME:latest 
docker push $ECR/$NAME:latest 
echo "✅ Successfully pushed $NAME (AMD64)" 
done
echo "All images pushed successfully!"
