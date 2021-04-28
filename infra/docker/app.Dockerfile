FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app

ADD app ./app
ADD config ./config
COPY index.js package.json ./
COPY dev.env .env

RUN yarn --version && yarn install
EXPOSE 3000

CMD ["yarn", "dev"]