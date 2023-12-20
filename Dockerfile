# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.14.2

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

#ENV NODE_ENV=production

RUN npm -g add pnpm
RUN corepack enable

WORKDIR /src

# Build
FROM base as build

COPY --link package.json pnpm-lock.yaml ./
#RUN npm install --production=false
RUN pnpm install --frozen-lockfile

COPY --link . .

#RUN npm run build
RUN pnpm run -r build
RUN pnpm prune
#RUN npm prune

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]