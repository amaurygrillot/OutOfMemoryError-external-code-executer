# syntax=docker/dockerfile:1

FROM node:12.18.1

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . .

RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list
RUN apt-get update
RUN apt install --yes openjdk-11-jdk
RUN npm ci
RUN apt-get install --yes python3
RUN apt-get install --yes gcc


RUN chmod -R 700 /app
RUN chmod -R 755 files

USER node

RUN npm test
CMD [ "npm", "start" ]
