# BathyBoatWeb
![Status](https://img.shields.io/badge/Status-In%20Development-red.svg)
![NodeJS](https://img.shields.io/badge/NodeJS-v8.9.4-green.svg)
![NPM](https://img.shields.io/badge/npm-5.6.0-green.svg)

Hydro/Rob Project - Guerlédan 2017/2018 - WebApp  
This project aims at providing a web-based monitoring and planning UI for robots.



## Installation
The web server uses the version v8.9.4 LTS of the [NodeJS](https://nodejs.org/en) framework.  
NodeJS (alongside npm) can be installed [via apt](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) for Debian and Ubuntu based distributions.  

Once NodeJS is installed and the repository cloned, open a terminal in the root directory and install all packages:
```shell
npm install
```
You should now be ready to go:
```shell
nodejs ./server/app.js
```
The web server is now running on port 29201, you can test it by accessing the url `http://localhost:29201`.


## Configuration
Coming soon.


## Web server
The web server is performing different tasks:
- Dowloading map tiles and keeping them for further session
- Receiving data from a ROS TCP server
- Sending commands to a ROS TCP server
- Sending real-time video stream to the web client via web socket
