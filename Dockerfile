FROM node:14-alpine

WORKDIR /home/app

COPY . .

RUN yarn && yarn build

EXPOSE 9000

CMD ["yarn", "start"]
