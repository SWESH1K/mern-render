### Multi-stage Dockerfile for building client and running express server
# Stage 1: build the React client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm install --silent
COPY client/ .
RUN npm run build

# Stage 2: install server deps and copy built client
FROM node:20-alpine AS server
WORKDIR /app
# Install server dependencies
COPY server/package.json server/package-lock.json* ./
RUN npm install --production --silent

# Copy server source
COPY server/ ./server

# Copy built client assets into server/public (webpack outputs to client/public)
COPY --from=client-build /app/client/public ./server/public

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

WORKDIR /app/server
CMD ["node", "index.js"]
