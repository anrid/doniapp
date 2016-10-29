#!/bin/bash
KAFKA_CONTAINER=$(docker ps | grep kafka | awk '{ print $1 }')
echo $KAFKA_CONTAINER
docker exec -it $KAFKA_CONTAINER /bin/bash
