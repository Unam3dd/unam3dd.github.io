FROM chainguard/node:latest
USER root
RUN npm install hexo-cli -g
EXPOSE 4000
USER node
ENTRYPOINT ["/usr/local/bin/hexo"]
