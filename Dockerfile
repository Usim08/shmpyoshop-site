FROM node:16

WORKDIR /app

COPY package.json yarn.lock package-lock.json ./ 

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
