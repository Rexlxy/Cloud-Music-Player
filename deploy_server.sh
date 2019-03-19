#!/bin/csh
cd server/src/CloudMusicPlayer
bee pack -be GOOS=linux -be GOARCH=386
ssh root@47.254.30.115 'cd ~/CloudMusicPlayer; rm -rf *; pkill CloudMusicPlaye'
scp CloudMusicPlayer.tar.gz root@47.254.30.115:~/CloudMusicPlayer
ssh root@47.254.30.115 'cd ~/CloudMusicPlayer; gunzip CloudMusicPlayer.tar.gz; tar -xvf CloudMusicPlayer.tar; nohup ./CloudMusicPlayer >/dev/null 2>&1 &'