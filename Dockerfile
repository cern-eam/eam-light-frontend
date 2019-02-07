# build EAM Light first
FROM node:10.15.0 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/
RUN npm install
RUN npm install react-scripts@2.1.3 -g
COPY . /usr/src/app
ENV REACT_APP_BACKEND "http://macen35644.cern.ch/SSO/eamlightws/rest"
ENV PUBLIC_URL "/"
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d 
RUN mkdir /etc/nginx/conf.d
COPY docker/default.conf /etc/nginx/conf.d
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
