#!/bin/sh
# wait-for-it.sh

set -e

host="backend"
port="4000"

until nc -z $host $port; do
  >&2 echo "$host:$port is unavailable - sleeping"
  sleep 1
done

>&2 echo "$host:$port is up - starting nginx"
exec nginx -g 'daemon off;'