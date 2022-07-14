if [ ! -d "/etc/smbcredentials" ]; then
mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/outofmemorycodeexecuter.cred" ]; then
    bash -c 'echo "username=outofmemorycodeexecuter" >> /etc/smbcredentials/outofmemorycodeexecuter.cred'
    bash -c 'echo "password=POslAt0EElPkHHUf1Xhe24LXbFhyJLjtzuOivP/kQnAtU7hjIMRIw1d8AbsSRd1EP1ifHJpDH+0y+AStgOowZA==" >> /etc/smbcredentials/outofmemorycodeexecuter.cred'
fi
chmod 600 /etc/smbcredentials/outofmemorycodeexecuter.cred

bash -c 'echo "//outofmemorycodeexecuter.file.core.windows.net/user-programs /mnt/user-programs cifs nofail,credentials=/etc/smbcredentials/outofmemorycodeexecuter.cred,dir_mode=0777,file_mode=0777,serverino,nosharesock,actimeo=30" >> /etc/fstab'
mount -t cifs //outofmemorycodeexecuter.file.core.windows.net/user-programs /mnt/user-programs -o credentials=/etc/smbcredentials/outofmemorycodeexecuter.cred,dir_mode=0777,file_mode=0777,serverino,nosharesock,actimeo=30