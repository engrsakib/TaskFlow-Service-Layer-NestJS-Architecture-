# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/


RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Final Run
FROM node:22-alpine
WORKDIR /app


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma


ENV NODE_ENV=production

EXPOSE 4000

CMD ["sh", "-c", "node dist/main.js || node dist/src/main.js"]