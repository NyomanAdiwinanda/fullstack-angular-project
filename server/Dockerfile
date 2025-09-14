# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
RUN chown -R nodeuser:nodejs /app
USER nodeuser
EXPOSE 3000
CMD ["npm", "start"]
