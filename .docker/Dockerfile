FROM node:10.18.0-alpine as build
WORKDIR /app
COPY . ./

FROM nginx:alpine
WORKDIR /etc/nginx
ADD nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
