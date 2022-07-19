fakechroot fakeroot debootstrap bullseye /bullseye
fakechroot fakeroot chroot /bullseye apt-get install --yes openjdk-17-jdk openjdk-17-jre
fakechroot fakeroot chroot /bullseye apt-get install --yes python3
fakechroot fakeroot chroot /bullseye apt-get install --yes gcc
mkdir /bullseye/programs
chown -R node /bullseye
