# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.19.1

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node ha.js package.json .

RUN npm install 

ENV RAVEN_URLS=''

USER node

CMD node ha.js
