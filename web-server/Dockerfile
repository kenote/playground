FROM node:18.18.2-alpine3.18

WORKDIR /home/web-server

COPY docker/web-server/package.json /home/web-server/
COPY web-server/.output/ /home/web-server/.output/

ENV NODE_ENV=production

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "preview" ]