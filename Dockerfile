FROM node:0.12.5-slim
MAINTAINER Ryan Boucher ryan.boucher@distributedlife.com
COPY package.json game.js /app/
COPY game /app/game/
RUN apt-get update && apt-get install -y python make g++ && cd /app && npm i && rm /bin/sh && ln -s /bin/bash /bin/sh
EXPOSE  3000
CMD ["node", "/app/game.js"]
