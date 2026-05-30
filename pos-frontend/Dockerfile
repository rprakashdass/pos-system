# Stage 1: Install dependencies
FROM node:20.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build app
FROM node:20.11-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8082/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Run app (lightweight)
FROM node:20.11-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy required files
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]