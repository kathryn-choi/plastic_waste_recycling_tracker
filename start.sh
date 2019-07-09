#!/bin/bash

composer card delete -c admin@recycling_tracker
composer card delete -c PeerAdmin@hlfv1
cd fabric-dev-servers

sudo ./downloadFabric.sh
sudo ./startFabric.sh
./createPeerAdminCard.sh
cd ..

cd recycling_tracker

composer network install --card PeerAdmin@hlfv1 --archiveFile recycling_tracker@0.0.1.bna

composer network start --networkName recycling_tracker --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card


composer card import --file networkadmin.card

composer network ping --card admin@recycling_tracker

cd ..
