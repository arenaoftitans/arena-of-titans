#!/usr/bin/env bash

for file in $(grep -lr localhost:8080 src/* | grep -v spec.js); do
    sed -i 's#localhost:8080#www.arenaoftitans.com#g' $file
done

sed -i 's#localhost#172.17.0.4#g' src/main/java/com/aot/engine/api/Redis.java

mvn clean package
