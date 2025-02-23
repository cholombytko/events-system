FROM node:20 AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20 AS development
WORKDIR /app
COPY --from=dependencies /app .
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

FROM node:20 AS production
WORKDIR /app
COPY --from=dependencies /app .
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "run", "start:prod"]