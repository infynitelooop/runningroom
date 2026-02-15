FROM --platform=linux/amd64 node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM --platform=linux/amd64 nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
