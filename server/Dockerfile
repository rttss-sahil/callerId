FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build

FROM node:16-alpine AS final
WORKDIR /root/
COPY --from=builder ./usr/src/app/dist ./dist
COPY --from=builder ./usr/src/app/scripts ./scripts
COPY package*.json .
COPY yarn.lock .
RUN yarn install --production
CMD [ "yarn", "start" ]