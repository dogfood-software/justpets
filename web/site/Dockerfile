# syntax=docker/dockerfile:1

# Build from the repository root with FONTAWESOME_PACKAGE_TOKEN in your environment:
# docker build --build-arg FONTAWESOME_PACKAGE_TOKEN -f web/site/Dockerfile .
# Railway: keep the repository root as the build context and set
# RAILWAY_DOCKERFILE_PATH=web/site/Dockerfile and FONTAWESOME_PACKAGE_TOKEN.

FROM node:26-alpine AS base

RUN apk add --no-cache gcompat
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps

# install PNPM
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --parents ./**/package.json ./

# Railway exposes build variables through ARG and only supports cache mounts.
ARG FONTAWESOME_PACKAGE_TOKEN

# Store only the env reference in npm config, never the token itself.
RUN pnpm config set '//npm.fontawesome.com/:_authToken' '${FONTAWESOME_PACKAGE_TOKEN}' \
    && pnpm --filter @web/site... install --frozen-lockfile \
    && pnpm config delete '//npm.fontawesome.com/:_authToken'

# Inherit the complete pnpm workspace, including each package's dependency links.
FROM deps AS builder

COPY . .

# Railway only exposes build-time variables declared in this stage.
# The commit SHA supplies the deployment ID used by next.config.ts.
ARG RAILWAY_GIT_COMMIT_SHA
ENV RAILWAY_GIT_COMMIT_SHA=$RAILWAY_GIT_COMMIT_SHA

RUN pnpm --filter @web/site build \
    && mkdir -p web/site/.next/standalone/web/site/public \
    && cp -r web/site/.next/static web/site/.next/standalone/web/site/.next/static \
    && if [ -d web/site/public ]; then \
        cp -r web/site/public/. web/site/.next/standalone/web/site/public/; \
    fi

FROM base AS runner

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Standalone output preserves paths relative to outputFileTracingRoot (/app).
# It contains only traced runtime dependencies, the server, and assembled assets.
COPY --from=builder --chown=nextjs:nodejs /app/web/site/.next/standalone/ ./

WORKDIR /app/web/site
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
