# Use a multi-stage build for optimization
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/frontend.conf /etc/nginx/conf.d/frontend.conf

# Expose standard HTTP port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]



