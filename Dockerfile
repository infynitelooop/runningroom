FROM node:20 AS build
WORKDIR /app

# Copy ONLY package files first
COPY package.json package-lock.json ./

# Install deps (cached layer)
RUN npm install

# Copy rest of code
COPY . .

# Build React app
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
#COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
