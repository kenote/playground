#!/bin/bash

red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
plain='\033[0m'

BUILDPLATFORM=""

start() {
  while [ ${#} -gt 0 ]; do
    case "${1}" in
    --platform)
      BUILDPLATFORM=$2
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


buildImage () {
  sh ./build.sh
  rm -rf .deploy/docker
  mkdir -p .deploy/docker
  [[ $BUILDPLATFORM == '' ]] && PLATFORMFIELD="" || PLATFORMFIELD="--platform=$BUILDPLATFORM"
  docker build -f api-server/Dockerfile $PLATFORMFIELD --tag playground_api_server .
  docker build -f web-server/Dockerfile $PLATFORMFIELD --tag playground_web_server .
  docker builder prune
  docker save > .deploy/docker/playground_api_server.tar playground_api_server
  docker save > .deploy/docker/playground_web_server.tar playground_web_server
  tar -czvf .deploy/docker/api-server.tar.gz \
  ./api-server/channels/ \
  ./api-server/config/ \
  ./api-server/mails/ \
  ./api-server/views/
  echo "> Done."
}

start "${@:1}"
buildImage
