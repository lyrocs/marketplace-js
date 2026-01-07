FROM node:22.16.0-alpine3.22 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --prod

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN corepack enable pnpm && pnpm run build --ignore-ts-errors

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]