FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/ ./src/

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY package*.json ./
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:3002/health || exit 1
CMD ["node", "src/app.js"]
