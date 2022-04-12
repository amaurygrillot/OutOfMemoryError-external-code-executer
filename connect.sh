sudo mkdir /mnt/outofmemory-code-executer-files
if [ ! -d "/etc/smbcredentials" ]; then
sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/outofmemorycodeexecuter.cred" ]; then
    sudo bash -c 'echo "username=outofmemorycodeexecuter" >> /etc/smbcredentials/outofmemorycodeexecuter.cred'
    sudo bash -c 'echo "password=POslAt0EElPkHHUf1Xhe24LXbFhyJLjtzuOivP/kQnAtU7hjIMRIw1d8AbsSRd1EP1ifHJpDH+0y+AStgOowZA==" >> /etc/smbcredentials/outofmemorycodeexecuter.cred'
fi
sudo chmod 600 /etc/smbcredentials/outofmemorycodeexecuter.cred

sudo bash -c 'echo "//outofmemorycodeexecuter.file.core.windows.net/outofmemory-code-executer-files /mnt/outofmemory-code-executer-files cifs nofail,vers=3.0,credentials=/etc/smbcredentials/outofmemorycodeexecuter.cred,dir_mode=0777,file_mode=0777,serverino" >> /etc/fstab'
sudo mount -t cifs //outofmemorycodeexecuter.file.core.windows.net/outofmemory-code-executer-files /mnt/outofmemory-code-executer-files -o vers=3.0,credentials=/etc/smbcredentials/outofmemorycodeexecuter.cred,dir_mode=0777,file_mode=0777,serverino
