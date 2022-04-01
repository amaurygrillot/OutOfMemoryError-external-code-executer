# syntax=docker/dockerfile:1

FROM node:12.18.1
ENV NODE_ENV=production

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . .

RUN apt-get update
RUN npm install --save
RUN apt-get install --yes python3
RUN apt-get install --yes openjdk-11-jdk

CMD [ "npm", "build" ]
CMD [ "npm", "start" ]
