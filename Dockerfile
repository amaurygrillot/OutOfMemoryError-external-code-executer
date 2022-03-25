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

# check files list
RUN ls -a

RUN npm install --save
RUN npm run build
RUN npm run start

