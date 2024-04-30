FROM debian:12

SHELL ["/bin/bash","-c"]

RUN apt update -y
RUN apt install -y nodejs npm

RUN mkdir app

WORKDIR app

RUN mkdir node_modules
ADD node_modules ./node_modules

ADD package.json .

ADD package-lock.json .

RUN mkdir src
COPY src ./src

RUN npm install

EXPOSE 8000

CMD npm start
