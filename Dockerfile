# ──────────────────────────────────────────────────────────────────────────────
# Stage 1 – BUILD
#   Uses Node 18 Alpine to install deps and produce the static bundle.
#   Nothing from this stage leaks into the final image.
# ──────────────────────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:18-alpine AS builder

WORKDIR /app

# Copy manifests first so Docker can cache the npm install layer
COPY package.json package-lock.json ./

# Clean install (matches lock-file exactly, no scripts that need a browser)
RUN npm ci --ignore-scripts

# Copy the rest of the source
COPY . .

# Produce the optimised static bundle → /app/build
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2 – PRODUCTION
#   Minimal nginx Alpine image; only the compiled assets are copied in.
#   Runs as an unprivileged user (UID 101 = "nginx" in the official image).
# ──────────────────────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 nginx:1.27-alpine AS production

# Remove the default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy only the compiled static assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# nginx official Alpine image already creates the "nginx" user (UID 101).
# We adjust ownership so the worker process can write to temp dirs.
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

# Switch to non-root
USER nginx

# Expose port 8080 (unprivileged — required when running as non-root)
EXPOSE 8080

# Healthcheck: nginx responds on /health within 5s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

# Start nginx in the foreground (required for Docker PID 1)
CMD ["nginx", "-g", "daemon off;"]
