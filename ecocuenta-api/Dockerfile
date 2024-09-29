FROM node:22.9.0-alpine

# Create app directory
WORKDIR /usr/src/app

#Otra forma de hacerlo seria con el comando COPY package*.json ./
COPY ["/dist/package.json","/dist/package-lock.json","/usr/src/app/"]

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install --omit=dev

COPY ./dist/. .

EXPOSE 5070

CMD [ "node","app.js" ]