# Angular build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build production artifacts (outputs to dist/)
RUN npm run build

# Nginx stage to serve built app
FROM nginx:1.27-alpine AS runtime
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy Angular dist output (actual built browser assets live in dist/web/browser)
# We copy only the browser directory contents so index.html is at the nginx web root
COPY --from=build /app/dist/web/browser /usr/share/nginx/html
# Set non-root user for safety (nginx image already uses nginx user)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
