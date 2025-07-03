# ==================================
# STAGE 1: The "Builder" Stage
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the Next.js build command to create optimized production files
RUN npm run build

# ==================================
# STAGE 2: The "Runner" Stage
# ==================================
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the "builder" stage
# 1. Copy the production-ready node_modules
# 'npm install --omit=dev' is a smart way to install only production dependencies
COPY --from=builder /app/package.json ./package.json
RUN npm install --omit=dev

# 2. Copy the built Next.js application files
COPY --from=builder /app/.next ./.next

# 3. Copy the public folder and config files
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the port Next.js runs on
EXPOSE 3000

# The command to start the Next.js server in production mode
CMD ["npm", "start"]