#!/bin/sh 

docker build -t andesnqn/jenkins-check-api:latest .
docker push andesnqn/jenkins-check-api
