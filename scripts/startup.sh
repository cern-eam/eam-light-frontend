#!/bin/sh
mv /usr/share/nginx/html/environmentConfig.js /opt/environmentConfig.js
envsubst < /opt/environmentConfig.js >> /usr/share/nginx/html/environmentConfig.js 
nginx -g 'daemon off;'