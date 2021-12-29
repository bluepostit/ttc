#!/bin/bash

# Copy this file, renamed as `post-receive`, into the `hooks/` directory
# of your target git repository (deploy).

TARGET_DIR=/path/to/work/tree
GIT_DIR=$TARGET_DIR/.git
DOCKER_IMAGE=your-user-name/docker-image-name

echo ""
echo "> Updating git working tree"
git -C $TARGET_DIR pull origin master

../deploy/generate-version-info.sh

cd $TARGET_DIR

echo "> Building Docker image: ${DOCKER_IMAGE}"
sudo docker build --no-cache . -t $DOCKER_IMAGE

echo "> Restarting container."
sudo docker-compose down && sudo docker-compose up -d

echo "Done."
