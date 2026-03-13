# ── Stage 1: Install production dependencies ──
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

# ── Stage 2: Production runner ──
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src ./src
COPY package.json ./

# Create uploads directory and set ownership
RUN mkdir -p uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

CMD ["node", "src/server.js"]