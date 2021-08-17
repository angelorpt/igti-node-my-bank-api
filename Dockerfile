FROM node:14 as DEV
WORKDIR /app
EXPOSE 3000
CMD [ "npm", "dev" ]

FROM node:14 as PRD
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]