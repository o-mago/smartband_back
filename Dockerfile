FROM node:12

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 49160

CMD [ "node", "app.js" ]