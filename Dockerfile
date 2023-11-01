# Build stage
FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Runtime stage
FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", "index.js"]
