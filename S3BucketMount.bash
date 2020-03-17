#!/bin/bash
####
# This script automatically mount S3 Bucket
#
# Author: Asuk Nath
# Date: 05/24/2018
#
#
# Exmaple:
# sudo ./s3_mount.sh <AWS Access Key ID> <AWS Secret Access Key> <S3 Bucket Name>
###
echo "Please wait. Downloading dependencies....."

sudo apt-get -y install build-essential git libfuse-dev libcurl4-openssl-dev libxml2-dev mime-support automake libtool
sudo apt-get -y install pkg-config libssl-dev
sudo git clone https://github.com/s3fs-fuse/s3fs-fuse

cd s3fs-fuse/

sudo ./autogen.sh
sudo ./configure --prefix=/usr --with-openssl
sudo make && make install

## Create a file with AWS Access Key ID and AWS Secret Access Key
## <AWS Access Key ID>:<AWS Secret Access Key>
## ADFDFINSDLFIKLASFJID:KDIzeri5dfjlsflkfidifd34sdfkld390jdfjDFIJ

echo "Creating password file"

cd ~/
sudo touch .passwd-s3fs
sudo echo $1:$2 > .passwd-s3fs
sudo chmod 600 .passwd-s3fs

## Create a cache folder and apply permission.
sudo mkdir /tmp/cache 
sudo chmod 777 /tmp/cache

## Create a folder to use for mount path 
sudo mkdir /mnt/s3bucket

echo "Mounting bucket"
echo "-------------------"
sudo s3fs -o use_cache=/tmp/cache $3 /mnt/s3bucket
