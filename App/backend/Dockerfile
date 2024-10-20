

FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

COPY . /usr/src/app

EXPOSE 4000

CMD sh -c "npm uninstall bcrypt && npm install bcrypt && node index.js"