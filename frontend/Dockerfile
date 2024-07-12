FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

ENV VITE_API_URL https://story-follower-z73z8.ondigitalocean.app/
ENV VITE_PLACEHOLDER_URL https://nyc3.digitaloceanspaces.com/story-follower-bucket/static/placeholder/

CMD [ "serve", "-s", "dist" ]