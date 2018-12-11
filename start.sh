#!/usr/bin/env bash

# Create bridged network for internal container connections
sudo docker network create --driver bridge QEWD-Courier-Network

sudo docker run --network QEWD-Courier-Network --rm --name conductor -p 8000:8080 -v ~/QEWD-Courier/courier-conductor-service:/opt/qewd/mapped -v ~/QEWD-Courier/courier-conductor-service/www:/opt/qewd/www -v ~/QEWD-Courier/global_settings:/opt/qewd/mapped/global_settings -v ~/QEWD-Courier/courier-conductor-service/db/yottadb:/root/.yottadb/r1.22_x86_64/g -dit rtweed/qewd-server

# HelloWorld sample service
sudo docker run --network QEWD-Courier-Network --rm --name hello-world -p 8001:8080 -v ~/QEWD-Courier/hello-world-service:/opt/qewd/mapped -v ~/QEWD-Courier/hello-world-service/www:/opt/qewd/www -v ~/QEWD-Courier/global_settings:/opt/qewd/mapped/global_settings -v ~/QEWD-Courier/courier-conductor-service/db/yottadb:/root/.yottadb/r1.22_x86_64/g -dit rtweed/qewd-server

# Authentication and OpenID Connect services, if you want them
#sudo docker run --network QEWD-CourierNetwork --rm --name auth -p 8001:8080 -v ~/QEWD-Courier/authentication-service-phr:/opt/qewd/mapped -v ~/QEWD-Courier/authentication-service-phr/www:/opt/qewd/www -v ~/QEWD-Courier/yottadb/authentication:/root/.yottadb/r1.22_x86_64/g -v ~/QEWD-Courier/settings:/opt/qewd/mapped/settings -dit rtweed/qewd-server
#sudo docker run --network QEWD-CourierNetwork --rm --name oidc -p 8080:8080 -v ~/QEWD-Courier/openid-connect-server:/opt/qewd/mapped -v ~/QEWD-Courier/openid-connect-server/www:/opt/qewd/www -v ~/QEWD-Courier/settings:/opt/qewd/mapped/settings -v ~/QEWD-Courier/yottadb/openid-connect-server:/root/.yottadb/r1.22_x86_64/g -dit rtweed/qewd-server 


# Smoke test
sleep 5
curl http://127.0.0.1:8000/api/smokeTest
curl http://127.0.0.1/api/smokeTest
curl http://127.0.0.1/api/helloworld
