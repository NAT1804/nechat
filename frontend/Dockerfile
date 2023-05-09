FROM node:18 AS development

WORKDIR /workspace/ui/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --omit=dev

EXPOSE 4200

CMD ["npm", "run", "start"]
