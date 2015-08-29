#!/bin/bash

## Part MySQL
VOLUME_HOME="/var/lib/mysql"
MYSQL_INSTALLED="no"
if [[ ! -d $VOLUME_HOME/mysql ]]; then
    echo "=> An empty or uninitialized MySQL volume is detected in $VOLUME_HOME"
    echo "=> Installing MySQL ..."
    mysql_install_db > /dev/null 2>&1
    echo "=> Done!"  
else
    MYSQL_INSTALLED="yes"
fi
echo "=> Starting MySQL ..."
/usr/bin/mysqld_safe > /dev/null 2>&1 &
MYSQL_STATE=1
while [[ RET -ne 0 ]]; do
    echo "=> Waiting for confirmation of MySQL service startup"
    sleep 5
    mysql -uroot -e "status" > /dev/null 2>&1
    MYSQL_STATE=$?
done
if [ "$MYSQL_INSTALLED" = no ]; then
    /docker/create_mysql_admin_user.sh
fi

## Part Memcached
USERNOTEXISTSRET=true
getent passwd memcached >/dev/null 2>&1 && USERNOTEXISTSRET=false
if $USERNOTEXISTSRET; then
    useradd memcached -s /nologin
fi
echo "=> Starting memcached ..."
memcached -u memcached &

## Part Main
echo "=> Starting service ..."
npm start

