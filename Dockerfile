FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Copy admin views to dist (EJS files are not compiled by TypeScript)
RUN cp -r src/admin dist/

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]


