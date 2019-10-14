#!/bin/sh

TARGET_FOLDER="/usr/share/nginx/html"

if test "$CUSTOM_URL_PATH" != "/"
then
  TARGET_FOLDER="$TARGET_FOLDER$CUSTOM_URL_PATH"
  mkdir -p "$TARGET_FOLDER"
fi

echo "[INFO $(date +'%F %r')] The application will be hosted from here: $TARGET_FOLDER"

mv -v /opt/react-front-end/* $TARGET_FOLDER

echo "[INFO $(date +'%F %r')] Content moved to target folder"

mv $TARGET_FOLDER/environmentConfig.js /opt/environmentConfig.js
envsubst < /opt/environmentConfig.js >> $TARGET_FOLDER/environmentConfig.js 

echo "[INFO $(date +'%F %r')] Environment settings updated"

nginx -g 'daemon off;'