# syntax=docker/dockerfile:1
#runs on debian 11
FROM node:14-bullseye-slim@sha256:e300712d69f83d550e42ee312cc59c24279ba86c69a1c91df6027e32d3b3fa6a

ENV NODE_ENV production
# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . .
RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list
RUN apt-get update
RUN apt install --yes openjdk-17-jdk openjdk-17-jre \
    && apt-get install --yes sudo \
    && apt-get install --yes python g++ build-essential \
    && npm ci --only=production\
    && apt-get install --yes python3 \
    && apt-get install --yes gcc \
    && apt-get install --yes rsync\
    && apt-get install --yes libcap2-bin  \
    # Install OpenSSH and set the password for root to "Docker!". In this example, "apk add" is the install instruction for an Alpine Linux-based image.
    && apt-get install --yes openssh-server \
    && echo "root:Docker!" | chpasswd \
    && echo "node:Docker!" | chpasswd \
    && adduser node sudo \
    && useradd spawn -u 1500 \
    && echo "spawn:Docker!" | chpasswd

#create chroot environment

#copy commands
RUN rsync -avz /usr/bin /app/usr \
    && rsync -avz /bin /app

#commands dependencies
RUN rsync -avz /lib /app  \
    && rsync -avz /lib64 /app \
    && rsync -avz /usr/lib /app/usr
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

RUN setcap cap_net_bind_service=+ep `readlink -f \`which node\``

RUN /app/node_modules/typescript/bin/tsc index.ts
RUN chown -R node:node /app
RUN chmod -R 500 /app

USER node

CMD ["node", "index.js"]
