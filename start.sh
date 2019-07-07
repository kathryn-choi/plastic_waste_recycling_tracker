#!/bin/bash

cd fabric-dev-servers

sudo ./downloadFabric.sh
sudo ./startFabric.sh
./createPeerAdminCard.sh