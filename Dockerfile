# syntax=docker/dockerfile:1
#runs on debian 11
FROM node:14-bullseye-slim@sha256:e300712d69f83d550e42ee312cc59c24279ba86c69a1c91df6027e32d3b3fa6a

ENV NODE_ENV production
ARG SU_PASSWORD
ENV SU_PASSWORD=$SU_PASSWORD
# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . .
RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list
RUN apt-get update
RUN apt-get install --yes apt-utils
RUN apt-get install --yes sudo

#build chroot env
RUN apt-get install --yes debootstrap
RUN apt-get install --yes fakechroot
RUN apt-get install --yes fakeroot
RUN apt-get --no-install-recommends install --yes systemd

#enable ssh
RUN apt-get install --yes libcap2-bin  \
    # Install OpenSSH and set the password for root
    && apt-get install --yes openssh-server \
    && echo "root:$SU_PASSWORD" | chpasswd \
    && echo "node:$SU_PASSWORD" | chpasswd
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

#build node env
RUN npm ci --only=production
RUN setcap cap_net_bind_service=+ep `readlink -f \`which node\``
RUN /app/node_modules/typescript/bin/tsc index.ts
RUN chown -R node:node /app
RUN chmod -R 500 /app
USER node
CMD ["node", "index.js"]
