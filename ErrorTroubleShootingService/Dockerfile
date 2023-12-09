FROM node:alpine

WORKDIR /usr/app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 8110

CMD ["npm", "run", "dev"]