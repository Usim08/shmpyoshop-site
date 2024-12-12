FROM node:16

WORKDIR /app

COPY package.json yarn.lock package-lock.json ./ 

COPY . .

EXPOSE 3019

CMD ["node", "server.js"]
