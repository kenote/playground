#!/bin/bash

TARNAME=""
ISTAR=false

start() {
  while [ ${#} -gt 0 ]; do
    case "${1}" in
    --tar)
      ISTAR=true
      TARNAME=$2
      shift
    ;;
    *)
      echo "${red}Unknown parameter : $1${plain}"
      return 1
      shift
    ;;
    esac
    shift 1
  done
}

buildSource () {
  echo
  echo "正在编译 API 代码 ..."
  echo
  cd api-server && yarn build
  cd ..
  sleep 5

  echo
  echo "正在编译 WEB 代码 ..."
  echo
  cd web-server && yarn build
  cd ..
  sleep 5


  if [[ $ISTAR == true ]]; then
    mkdir -p .deploy
    [[ $TARNAME == '' ]] && TARFILE="playground.tar.gz" || TARFILE="$TARNAME.tar.gz"
    rm -rf .deploy/export
    mkdir -p .deploy/export/api-server
    cp -R ./api-server/channels/ ./.deploy/export/api-server/channels/
    cp -R ./api-server/config/ ./.deploy/export/api-server/config/
    cp -R ./api-server/mails/ ./.deploy/export/api-server/mails/
    cp -R ./api-server/views/ ./.deploy/export/api-server/views/
    cp -R ./api-server/dist/ ./.deploy/export/api-server/dist/
    cp ./api-server/package.json ./.deploy/export/api-server/
    mkdir -p .deploy/export/web-server
    cp -R ./web-server/.output/ ./.deploy/export/web-server/.output/
    cp ./docker/web-server/package.json ./.deploy/export/web-server/
    cp ./Makefile ./.deploy/export/
    cd ./.deploy/export
    tar -czvf $TARFILE .
    sleep 5
    echo "Done!"
  fi
}

start "${@:1}"
buildSource
