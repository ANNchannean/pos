# Use an official Node.js runtime as a parent image
FROM node:22-slim AS base

FROM base AS builder
# Set the working directory
# Install MySQL client tools
RUN apt update && apt install default-mysql-client -y
ENV TZ=Asia/Phnom_Penh
WORKDIR /app
# Install pnpm
# RUN npm install -g pnpm
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
# RUN pnpm install
RUN npm install --legacy-peer-deps
# RUN npm ci
# Copy the rest of the application code to the working directory
COPY . .
# RUN pnpm run build
# RUN pnpm prune --prod
# Build the SvelteKit application
# Expose the port the app runs on
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
# Define the command to run the application
CMD ["node", "--env-file=.env", "build"]