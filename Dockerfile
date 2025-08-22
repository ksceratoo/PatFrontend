FROM ocaml/opam:alpine-3.18-ocaml-4.14

# Install Node.js 20 (React Router requirement)
RUN sudo apk add --no-cache nodejs-current npm ca-certificates && \
  sudo rm -rf /var/cache/apk/*

WORKDIR /app

# Initialize opam environment
RUN eval $(opam env)

# Copy package files first for better caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci && npm cache clean --force

# Copy application code
COPY . .

# Build mbcheck with proper OCaml environment setup
RUN eval $(opam env) && \
  cd mbcheck && \
  echo "Installing dependencies..." && \
  opam install --yes cmdliner visitors ppx_import z3 menhir bag && \
  echo "Building mbcheck..." && \
  dune build && \
  echo "Setting permissions..." && \
  sudo chmod +x _build/default/bin/main.exe && \
  echo "Copying binary to project root..." && \
  cp _build/default/bin/main.exe /app/mbcheck-linux

# Build the Node.js application
RUN npm run build

# Create non-root user
RUN sudo addgroup -g 1001 -S nodejs && \
  sudo adduser -S nextjs -u 1001

# Set correct permissions for mbcheck binary
RUN sudo chmod +x mbcheck-linux

# Change ownership and switch to non-root user
RUN sudo chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:10000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["npm", "start"]
