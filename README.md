# Setup Guide

Uses the Lubuntu 20.4.1 LTS Image.

1. Install and setup VirtualBox / VMWare (https://webcms3.cse.unsw.edu.au/COMP9900/21T2/resources/61815)
2. Download the Lubuntu 20.4.1 LTS Image from here: (https://rebrand.ly/o1fy80n)
3. Follow the guides on WebCMS to setup the Lubuntu Image (VirtualBox Guide: https://webcms3.cse.unsw.edu.au/COMP9900/21T2/resources/63157)
4. Install Docker by following the instructions here (https://docs.docker.com/engine/install/ubuntu/) or running the commands below
```
sudo apt-get update
sudo apt install curl
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```
5. Install docker-compose
```
sudo apt install docker-compose
```
6. Extract the project files from the provided ZIP file to a new directory.  
(If using unzip)
```
sudo apt-get install unzip
unzip t18a-coodersFinalSoftwareQuality.zip -d t18a-cooders
```  
- Or clone the repository from github:
```
git clone https://github.com/COMP3900-9900-Capstone-Project/capstoneproject-comp3900-t18a-cooders.git t18a-cooders
```
7. Build the project from the root folder of the project as superuser
```
sudo docker-compose up -d --build
```

# Using Task Master
Task Master runs on localhost by default. Once built, the database must be initialized. In a web browser, navigate to:
> localhost:5000/initdb

This only needs to be run once, the database will persist on the machine even after the server is closed.

The app can now be used. It runs on port 3001 by default:
> localhost:3001

