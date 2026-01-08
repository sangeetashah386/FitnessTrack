# Step 1: Build React App
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY runtime-env.js /usr/share/nginx/html/runtime-env.js

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
