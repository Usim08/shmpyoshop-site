FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY src ./src
COPY tsconfig.json ./

RUN yarn build

CMD [ "yarn", "start" ]

EXPOSE 3019