FROM node:alpine3.15

COPY index.js package.json package-lock.json ./

ENTRYPOINT ["node", "index.js"]

