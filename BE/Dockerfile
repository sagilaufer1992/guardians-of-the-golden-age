FROM node:13.12.0-alpine
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
ENV NODE_ENV=production
CMD [ "node", "./dist/main.js" ]
