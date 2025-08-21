FROM node:18-alpine

WORKDIR /app

# Install system dependencies needed for mbcheck
RUN apk add --no-cache \
  gmp-dev \
  gcc \
  musl-dev \
  make \
  git \
  opam \
  && rm -rf /var/cache/apk/*

# Setup OCaml
RUN opam init --disable-sandboxing --yes && \
  opam switch create 4.14.0 && \
  eval $(opam env) && \
  opam install dune menhir ppx_import visitors cmdliner z3 bag --yes

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Clone and build mbcheck from the correct repository
RUN echo "Building mbcheck..." && \
  git clone https://github.com/SimonJF/mbcheck.git temp_mbcheck && \
  cd temp_mbcheck && \
  eval $(opam env) && \
  make && \
  cp _build/default/bin/main.exe ../patCom/paterl/mbcheck/mbcheck && \
  cd .. && \
  rm -rf temp_mbcheck && \
  chmod +x patCom/paterl/mbcheck/mbcheck

# Set executable permissions for mbcheck binaries
RUN chmod +x patCom/paterl/mbcheck/mbcheck mbcheck-linux 2>/dev/null || true

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:10000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["npm", "start"]