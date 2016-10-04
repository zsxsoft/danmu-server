FROM node:6.7.0
MAINTAINER zsx <zsx@zsxsoft.com> 

## ----------------------------
##       MariaDB Start
## ----------------------------
## Add MariaDB PPK
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db && \
    echo 'deb http://mirrors.syringanetworks.net/mariadb/repo/10.1/ubuntu trusty main' >> /etc/apt/sources.list && \
    echo 'deb-src http://mirrors.syringanetworks.net/mariadb/repo/10.1/ubuntu trusty main' >> /etc/apt/sources.list

RUN apt-get update


## Install MariaDB
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y mariadb-server pwgen && \
    rm -rf /var/lib/mysql/*
RUN sed -i -r 's/bind-address.*$/bind-address = 0.0.0.0/' /etc/mysql/my.cnf
VOLUME  ["/etc/mysql", "/var/lib/mysql"]
EXPOSE 3306
## ----------------------------
##       MariaDB End
## ----------------------------
## If comment the part of mariadb, then you should uncomment the following line.
## RUN apt-get update

## Install memcached
RUN apt-get install -y memcached
EXPOSE 11211

## Main
ENV APP /usr/src/app
RUN mkdir -p ${APP}/
WORKDIR ${APP}/
ADD ./ ./
ADD ./docker/ /docker
RUN chmod +x /docker/*.sh
RUN npm install

## Clean Garbage
RUN npm cache clean
RUN apt-get clean 
RUN rm -rf /var/lib/apt/lists/*

EXPOSE 3000
CMD ["/docker/run.sh"]
