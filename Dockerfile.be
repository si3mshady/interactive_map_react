
FROM node:alpine 
WORKDIR /app

COPY backend/package*  ./
RUN npm install  --force

RUN mkdir models
COPY backend/models/Pin.js models/Pin.js
COPY backend/models/User.js models/User.js
COPY backend/index.js ./index.js

ENV MONGO_CONNECT_URL=mongodb://db:27017/maps

LABEL developer=si3mshady
EXPOSE 8080
CMD ["node", "index.js"]

#docker build .  -f Dockerfile.be -t si3mshady/backend-map-dev:2
