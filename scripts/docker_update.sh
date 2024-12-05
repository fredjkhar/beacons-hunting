#!/bin/bash


cd ..

# Infinite loop to check for updates every 5 minutes
while true; do
    echo "Checking for new Docker images..."

    # Pull the latest images
    docker-compose pull

    # Check if any services have updated images
    updated_services=$(docker-compose pull | grep "Downloaded")

    if [ -n "$updated_services" ]; then
        echo "New images found, restarting containers..."

        # Build and restart the containers
        docker-compose up -d --build
        echo "Containers restarted with updated images."
    else
        echo "No new images found."
    fi

    # Wait for 5 minutes before checking again
    sleep 300
done
