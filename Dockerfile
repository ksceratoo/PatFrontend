FROM node:18-alpine

WORKDIR /app

# Install system dependencies needed for mbcheck
RUN apk add --no-cache \
  gmp-dev \
  gcc \
  musl-dev \
  make \
  && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Clone the paterl submodule/repository and build mbcheck
RUN if [ ! -d "patCom/paterl" ]; then \
    git clone https://github.com/duncanatt/paterl.git patCom/paterl; \
  fi && \
  echo "Building mbcheck..." && \
  cd patCom/paterl/mbcheck && \
  make && \
  chmod +x mbcheck

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