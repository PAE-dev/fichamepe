# Imagen de producción explícita: build + runtime en el mismo flujo (sin Railpack/Nixpacks en medio).
# Railway: servicio con Root Directory = `backend`, Builder = Dockerfile (automático si existe este archivo).
# En la UI dejá VACÍOS "Custom Build Command" y "Custom Start Command" para que use este Dockerfile.

FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
