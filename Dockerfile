FROM chainguard/node:latest
USER root
COPY . /app/
RUN npm install hexo-cli -g && npm update && npm install
USER node
EXPOSE 4000
RUN /usr/local/bin/hexo generate
ENTRYPOINT ["/usr/local/bin/hexo", "server"]
