FROM node:alpine

RUN mkdir -p /usr/src/cloud-devops-rest-api && chown -R node:node /usr/src/cloud-devops-rest-api

WORKDIR /usr/src/cloud-devops-rest-api

COPY package.json ./

USER root

RUN yarn install --pure-lockfile
#RUN apk update
#RUN apk add git
#RUN npm install

COPY . .

EXPOSE 443
