#!/usr/bin/env bash

set -e

if [[ $(hostname) == giskard ]]; then
    cd ~/aot/docker

    # Stop the running container if it exists and delete it
    running_container_id=$(docker ps -a | grep aot | awk '{FS=" "; print $1}')
    if [[ -n "${running_container_id}" ]]; then
        docker stop "${running_container_id}"
        docker rm "${running_container_id}"
        image_id=$(docker  images | grep aot | awk '{FS=" "; print $3}')
        docker rmi "${image_id}"
    fi

    # Build and run the new image
    docker build -t aot .
    docker run --name aot -d -p 8280:8080 aot
else
    mvn clean package

    scp target/aot.war aot:~/aot/docker/

    gulp prod
    rsync -a --delete prd/ aot:app/
fi
