# build EAM Light first
FROM node:10.15.0 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/
RUN npm install && \
  npm install react-scripts@2.1.3 -g
COPY . /usr/src/app
ENV REACT_APP_BACKEND "http://localhost:8081/apis/rest"
ENV PUBLIC_URL "/"
ENV REACT_APP_LOGIN_METHOD "STD"
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
ENV REACT_APP_BACKEND_URL "http://localhost:8081/apis/rest"
RUN rm -rf /etc/nginx/conf.d && \
  mkdir /etc/nginx/conf.d 
COPY scripts/startup.sh /opt/
COPY docker/default.conf /etc/nginx/conf.d
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/
RUN chmod a+x /opt/startup.sh 
EXPOSE 8080
CMD ["/opt/startup.sh"]
