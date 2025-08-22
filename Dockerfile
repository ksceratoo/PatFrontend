FROM ocaml/opam:alpine-3.18-ocaml-4.14

# Install Node.js
RUN sudo apk add --no-cache nodejs npm && \
  sudo rm -rf /var/cache/apk/*

WORKDIR /app

# Initialize opam environment
RUN eval $(opam env)

# Copy package files
COPY package*.json ./

# Install Node.js dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy application code
COPY . .

# Build mbcheck using the build script
RUN chmod +x build-mbcheck.sh && \
  ./build-mbcheck.sh || \
  (echo "Build script failed, checking for existing binary..." && \
  if [ -f "mbcheck/_build/default/bin/main.exe" ]; then \
  echo "Found existing binary, making executable..." && \
  chmod +x mbcheck/_build/default/bin/main.exe; \
  else \
  echo "No mbcheck binary found - Pat type checking will not work"; \
  fi)

# Verify mbcheck was built correctly
RUN ls -la mbcheck/_build/default/bin/main.exe 2>/dev/null || echo "Warning: mbcheck executable not found"

# Build the Node.js application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

# Ensure mbcheck executable has correct permissions
RUN chmod +x mbcheck/_build/default/bin/main.exe && \
  ls -la mbcheck/_build/default/bin/main.exe

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