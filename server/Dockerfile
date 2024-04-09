FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm run build
COPY . .

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000

CMD [ "npm", "start" ]