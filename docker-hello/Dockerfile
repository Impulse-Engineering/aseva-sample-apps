FROM docker.io/library/node:20-slim
WORKDIR /app
COPY package.json server.js ./
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]
