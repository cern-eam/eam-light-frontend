# build EAM Light first
FROM node:16.14.0 AS builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH=/usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/
RUN npm install --force
COPY . /usr/src/app
ENV VITE_BACKEND="/apis/rest"
ENV VITE_PUBLIC_URL="/"
ENV VITE_LOGIN_METHOD="STD"
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d && mkdir /etc/nginx/conf.d
COPY docker/default.conf /etc/nginx/conf.d
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
