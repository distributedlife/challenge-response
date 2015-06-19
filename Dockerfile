FROM node:latest

MAINTAINER Ryan Boucher ryan.boucher@distributedlife.com

RUN npm i ensemblejs -g

ADD package.json /app/package.json
ADD game /app/game
ADD dist/js /app/game/js/gen
# ADD dist/css /app/game/css
ADD supporting-libs /app/supporting-libs
ADD three-js-dep /app/three-js-dep

RUN cd /app; npm i

EXPOSE 3000

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
CMD ["start", "/app/game"]