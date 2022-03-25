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

RUN npm install --save
EXPOSE 3001
CMD [ "npm", "start" ]
