## -*- docker-image-name: "aot-java" -*-
# AoT
#
# Version 1

FROM glassfish:latest

MAINTAINER Jujens "jujens@jujens.eu"

RUN apt-get update
RUN apt-get install -y redis-server
RUN apt-get clean

COPY aot.war /
COPY start.sh /

EXPOSE 8080

ENTRYPOINT ["/start.sh"]
