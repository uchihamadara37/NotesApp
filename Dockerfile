# Install dependencies and build
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve with next start
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
ENV PORT 8080
CMD ["npm", "start"]