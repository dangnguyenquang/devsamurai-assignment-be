FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]