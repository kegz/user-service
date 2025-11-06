# ---- Base build stage ----
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and compile TS → JS
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy only what’s needed at runtime
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=8081
EXPOSE 8081

# Start the compiled service
CMD ["node", "dist/index.js"]
