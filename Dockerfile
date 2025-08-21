FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
# Install OCaml and build dependencies
RUN apk add --no-cache \
    opam \
    gmp-dev \
    gcc \
    musl-dev \
    make \
    git \
    bash

COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

# Build mbcheck first
RUN ./build-mbcheck.sh

# Then build the Node.js application
RUN npm run build

FROM node:20-alpine
# Install runtime dependencies for mbcheck
RUN apk add --no-cache gmp bash

COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
# Copy the entire patCom directory including built mbcheck
COPY --from=build-env /app/patCom /app/patCom
WORKDIR /app
CMD ["npm", "run", "start"]