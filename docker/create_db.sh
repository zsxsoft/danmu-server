#!/bin/bash

if [[ $# -eq 0 ]]; then
	echo "Usage: $0 <db_name>"
	exit 1
fi

echo "=> Creating database $1"
RET=1
while [[ RET -ne 0 ]]; do
	sleep 5
	mysql -uroot -e "CREATE DATABASE $1"
	RET=$?
done

echo "=> Done!"
