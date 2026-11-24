# syntax=docker/dockerfile:1

FROM node:26-alpine AS base

RUN apk add --no-cache gcompat
WORKDIR /app

FROM base AS build

# install PNPM
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --parents ./**/package.json ./

ARG FONTAWESOME_PACKAGE_TOKEN
ARG HEROUI_AUTH_TOKEN

ENV HEROUI_AUTH_TOKEN=$HEROUI_AUTH_TOKEN

# Store only the env reference in npm config, never the token itself.
RUN pnpm config set '//npm.fontawesome.com/:_authToken' '${FONTAWESOME_PACKAGE_TOKEN}' \
    && pnpm --filter @web/app... install --frozen-lockfile \
    && pnpm config delete '//npm.fontawesome.com/:_authToken'

ARG ENVIRONMENT=production
ARG POSTHOG_PROJECT_TOKEN

ENV ENVIRONMENT=$ENVIRONMENT \
    POSTHOG_PROJECT_TOKEN=$POSTHOG_PROJECT_TOKEN

COPY . .

RUN pnpm --filter @web/app... generate
RUN pnpm --filter @web/app build

FROM caddy:2-alpine

COPY --from=build /app/web/app/dist /app/apps/web/dist
COPY web/app/Caddyfile /etc/caddy/Caddyfile

ENV PORT=8080
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
