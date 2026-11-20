# Build from the repository root: docker build -f backend/api/Dockerfile .

FROM oven/bun:alpine AS build

RUN apk add --no-cache nodejs npm \
    && npm install --global pnpm@12.8.1 --ignore-scripts

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/api/package.json ./backend/api/package.json
COPY backend/db/package.json ./backend/db/package.json
COPY libraries/attributes/package.json ./libraries/attributes/package.json
COPY libraries/i18n/package.json ./libraries/i18n/package.json

RUN pnpm --filter @backend/api... install --frozen-lockfile --ignore-scripts --trust-lockfile

COPY tsconfig.base.json ./
COPY backend/api/tsconfig.json ./backend/api/tsconfig.json
COPY backend/api/src/ ./backend/api/src/
COPY backend/db/src/ ./backend/db/src/
COPY libraries/attributes/src/ ./libraries/attributes/src/
COPY libraries/i18n/src/ ./libraries/i18n/src/

RUN pnpm --filter @backend/api build \
    && pnpm --filter @backend/db build:migrations

FROM oven/bun:alpine

RUN apk add --no-cache ca-certificates libstdc++

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4041

COPY --from=build --chown=bun:bun /app/backend/api/dist/ ./dist/
COPY --from=build --chown=bun:bun /app/backend/db/dist/ ./dist/

USER bun

EXPOSE 4041

CMD ["bun", "./dist/server.js"]
