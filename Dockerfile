# syntax=docker/dockerfile:1
#runs on debian 11
FROM node:14-bullseye-slim@sha256:e300712d69f83d550e42ee312cc59c24279ba86c69a1c91df6027e32d3b3fa6a

ENV NODE_ENV production
# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
# copy source code to /app/src folder
COPY --chown=node:node . .
RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list
RUN apt-get update
RUN apt install --yes openjdk-17-jdk openjdk-17-jre \
    && apt-get install --yes sudo \
    && apt-get install --yes python g++ build-essential \
    && npm ci --only=production\
    && apt-get install --yes python3 \
    && apt-get install --yes gcc \
    # Install OpenSSH and set the password for root to "Docker!". In this example, "apk add" is the install instruction for an Alpine Linux-based image.
    && apt-get install --yes openssh-server \
    && echo "root:Docker!" | chpasswd

# Copy the sshd_config file to the /etc/ssh/ directory
COPY ssh/sshd_config /etc/ssh/

# Copy and configure the ssh_setup file
RUN mkdir -p /tmp
COPY ssh/ssh_setup.sh /tmp
RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)
# Open port 2222 for SSH access
EXPOSE 80 2222
RUN /usr/sbin/sshd

RUN sh -c tsc index.ts


CMD [ "node", "index.js" ]
