FROM node:17.9.0-alpine3.15
WORKDIR /usr
COPY . .
RUN ls -a
RUN npm install
EXPOSE 3334
CMD ["npm","run", "server"]