FROM node:16.20.2-alpine3.18

WORKDIR /usr/src/app/

COPY api-server/package.json /usr/src/app/
COPY api-server/dist/ /usr/src/app/dist/

RUN apk add --no-cache mongodb-tools

RUN npm install --production

ENV NODE_ENV=production

EXPOSE 4000

CMD [ "node", "./dist/main.js" ]