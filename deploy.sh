#!/bin/bash

# deploy.sh
# DO not EXECUTE UNLESS REQUIRED
# Manually build, push and run ELK stack containers.
# Exit immediately if a command exits with a non-zero status
set -e

export ELASTIC_VERSION=8.15.1

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found. Please create one with the required variables."
  exit 1
fi

# Check for required environment variables
if [ -z "$ELASTIC_VERSION" ] || [ -z "$ELASTIC_PASSWORD" ] || [ -z "$KIBANA_SYSTEM_PASSWORD" ]; then
  echo "Required environment variables are missing."
  echo "Ensure ELASTIC_VERSION, ELASTIC_PASSWORD, and KIBANA_SYSTEM_PASSWORD are set in the .env file."
  exit 1
fi

# Set Docker Hub username and repository
DOCKER_USERNAME="fredjk"
DOCKER_REPO="threat-hunting-elk-stack"

# Build Elasticsearch image
echo "Building Elasticsearch image..."
docker build -t $DOCKER_USERNAME/$DOCKER_REPO:elasticsearch-$ELASTIC_VERSION \
  --build-arg ELASTIC_VERSION=$ELASTIC_VERSION \
  -f elasticsearch/Dockerfile elasticsearch/

# Build Kibana image
echo "Building Kibana image..."
docker build -t $DOCKER_USERNAME/$DOCKER_REPO:kibana-$ELASTIC_VERSION \
  --build-arg ELASTIC_VERSION=$ELASTIC_VERSION \
  -f kibana/Dockerfile kibana/

# Build Setup image (if applicable)
echo "Building Setup image..."
docker build -t $DOCKER_USERNAME/$DOCKER_REPO:setup-$ELASTIC_VERSION \
  --build-arg ELASTIC_VERSION=$ELASTIC_VERSION \
  -f setup/Dockerfile setup/

# Login to Docker Hub
echo "Logging into Docker Hub..."
docker login -u $DOCKER_USERNAME

# Push images to Docker Hub
echo "Pushing Elasticsearch image to Docker Hub..."
docker push $DOCKER_USERNAME/$DOCKER_REPO:elasticsearch-$ELASTIC_VERSION

echo "Pushing Kibana image to Docker Hub..."
docker push $DOCKER_USERNAME/$DOCKER_REPO:kibana-$ELASTIC_VERSION

echo "Pushing Setup image to Docker Hub..."
docker push $DOCKER_USERNAME/$DOCKER_REPO:setup-$ELASTIC_VERSION

# Run the setup service
#echo "Running the setup service..."
#docker-compose --profile setup up setup

# Start Elasticsearch and Kibana services
echo "Starting Elasticsearch and Kibana services..."
docker-compose up -d elasticsearch kibana

echo "Deployment complete."