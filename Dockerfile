FROM node:latest
WORKDIR /app
COPY package.json /app
RUN npm install sails -g
COPY . /app
CMD ["sails", "lift"]
EXPOSE 1337