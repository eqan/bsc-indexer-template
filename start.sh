# Script for starting the server and running the project with 1 command
sudo service postgresql start
sudo service redis-server start
npm run start:dev
yarn start:debug
