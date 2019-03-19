#!/bin/csh
cd webapp
ng build
cd dist
zip -r webapp.zip webapp
scp webapp.zip root@47.254.30.115:/home/wwwroot/CloudMusicPlayer
ssh root@47.254.30.115 'cd /home/wwwroot/CloudMusicPlayer; rm -rf webapp;unzip webapp.zip'
