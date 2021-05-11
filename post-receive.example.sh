#!/bin/sh

# Copy this file, renamed as `post-receive`, into the `hooks/` directory
# of your target git repository (deploy).

GIT_WORK_TREE=/path/to/work/tree
GIT_DIR=$GIT_WORK_TREE/.git
DOCKER_IMAGE=your-user-name/docker-image-name

echo ""
echo "> Updating git working tree"
git pull origin master

cd $GIT_WORK_TREE
echo "> Building Docker image: ${DOCKER_IMAGE}"
sudo docker build --no-cache . -t $DOCKER_IMAGE

echo "> Restarting container."
sudo docker-compose down && sudo docker-compose up -d

echo "Done."
