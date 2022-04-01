# syntax=docker/dockerfile:1

FROM node:12.18.1
ENV NODE_ENV=production

RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list
RUN apt-get update
RUN apt install --yes openjdk-11-jdk
RUN npm install --save
RUN apt-get install --yes python3
RUN apt-get install --yes gcc



# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . .



CMD [ "npm", "build" ]
CMD [ "npm", "start" ]
