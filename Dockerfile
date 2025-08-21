FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Set executable permissions for mbcheck binaries
RUN chmod +x patCom/paterl/mbcheck/mbcheck mbcheck-linux 2>/dev/null || true

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]