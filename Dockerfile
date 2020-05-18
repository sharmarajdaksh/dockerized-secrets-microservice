FROM node:alpine

WORKDIR /usr/app/

COPY ./package*.json ./
RUN npm install

RUN npm install pm2 -g

COPY ./ ./

CMD [ "pm2-runtime", "npm", "--", "start" ]