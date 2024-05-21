#!/bin/bash

set -e

function cleanup {
    kill -9 $(pgrep tmux)
}

if [ ! -r "license.json" ]; then
  echo "Can't find/open license.json. Get it from https://ravendb.net/license/request/dev and put it in a file directory. Exiting..."
  exit 1
fi

trap cleanup EXIT

if [ ! -r "ravendb.tar.bz2" ]; then
  echo "Download RavenDB server package..."
  wget -O ravendb.tar.bz2 https://daily-builds.s3.amazonaws.com/RavenDB-6.0.103-linux-x64.tar.bz2
fi

for nodeNum in $(seq 1 3); do
targetDir="rvn_cluster/node${nodeNum}" 
mkdir -p "$targetDir"
echo "Unpack RavenDB server package to $targetDir..."
tar xjf ravendb.tar.bz2 --strip-components=1 -C "${targetDir}" &

done

wait

for nodeNum in $(seq 1 3); do

cp license.json "rvn_cluster/node${nodeNum}/Server"

envsubst <<SETTINGS > "rvn_cluster/node${nodeNum}/Server/settings.json"
{
  "ServerUrl": "http://localhost:808${nodeNum}",
  "ServerUrl.Tcp": "tcp://localhost:3888${nodeNum}",
  "DataDir": "RavenData",
  "Setup.Mode": "None",
  "License.Eula.Accepted": true,
  "License.Path": "license.json",
  "Security.UnsecuredAccessAllowed": "PublicNetwork",
  "Cluster.TimeBeforeAddingReplicaInSec": 90
}
SETTINGS

rm -rf "rvn_cluster/node${nodeNum}/Server/RavenData"

done

set -x
tmux new -d; tmux splitw -dh; tmux split -d; tmux select-pane -t right; tmux split -d; tmux select-pane -t left; 
tmux send-keys 'cd rvn_cluster/node1/Server; ./Raven.Server' Enter
tmux select-pane -t right
tmux send-keys 'cd rvn_cluster/node2/Server; ./Raven.Server' Enter
tmux select-pane -t bottom
tmux send-keys 'cd rvn_cluster/node3/Server; ./Raven.Server' Enter
tmux select-pane -t right
tmux a
