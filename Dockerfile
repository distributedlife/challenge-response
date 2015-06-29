MAINTAINER Ryan Boucher ryan.boucher@distributedlife.com
FROM node:0.12.5-slim
COPY package.json game.js /app/
COPY game /app/game/
RUN cd /app && npm i && rm /bin/sh && ln -s /bin/bash /bin/sh
EXPOSE  3000
CMD ["npm", "start"]
