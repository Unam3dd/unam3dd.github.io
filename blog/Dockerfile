FROM chainguard/node:latest
COPY . /app/
USER root
RUN npm install hexo-cli -g && npm update && npm install
USER node
EXPOSE 4000
RUN whoami
RUN /usr/local/bin/hexo generate
ENTRYPOINT ["/usr/local/bin/hexo", "server", "-s"]
