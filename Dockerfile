FROM node:20-alpine

WORKDIR /app


COPY package.json yarn.lock ./

RUN yarn cache clean

COPY . .

RUN yarn install

COPY .env ./

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
