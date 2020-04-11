FROM node:13.12.0-alpine
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install
RUN npm build
COPY . .
EXPOSE 3001
ENV NODE_ENV=production
CMD [ "node", "./dist/main.js" ]
