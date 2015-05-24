#!/usr/bin/env bash

if [[ $(hostname) == giskard ]]; then
    cd ~/aot/docker
    docker build -t aot .
    docker run --name aot -d -p 8080:8080 aot
else
    mvn clean package

    scp target/aot.war aot:~/aot/docker/

    cd ..
    gulp prod
    rsync -a prd/ aot:app/
fi
