FROM oven/bun:alpine

RUN apk add --no-cache ca-certificates libstdc++

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4041

COPY --chown=bun:bun dist/ ./dist/

USER bun

EXPOSE 4041

CMD ["bun", "./dist/server.js"]
