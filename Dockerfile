FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3130

CMD ["npm", "start"]