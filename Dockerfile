FROM node:latest
MAINTAINER zsx <zsx@zsxsoft.com>
ENV APP /usr/src/app

## ----------------------------
##       MariaDB Start
## ----------------------------
## Add MariaDB PPK
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db && \
    echo 'deb http://mirrors.syringanetworks.net/mariadb/repo/10.1/ubuntu trusty main' >> /etc/apt/sources.list && \
    echo 'deb-src http://mirrors.syringanetworks.net/mariadb/repo/10.1/ubuntu trusty main' >> /etc/apt/sources.list  && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y mariadb-server pwgen && \
    rm -rf /var/lib/mysql/* && \
    sed -i -r 's/bind-address.*$/bind-address = 0.0.0.0/' /etc/mysql/my.cnf && \
    apt-get install -y memcached && \
    mkdir -p ${APP}


WORKDIR ${APP}/
ADD ./ ./
ADD ./docker/ /docker
RUN chmod +x /docker/*.sh && \
    npm install && \
    npm cache clean && apt-get clean && rm -rf /var/lib/apt/lists/*

VOLUME  ["/etc/mysql", "/var/lib/mysql"]
EXPOSE 3306 11211 3000
CMD ["/docker/run.sh"]
