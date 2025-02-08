FROM oven/bun:1.2.2 AS base

RUN apt-get update && apt-get install default-mysql-client -y
ENV TZ=Asia/Phnom_Penh

WORKDIR /app

# RUN npm install -g pnpm

# ENV NODE_ENV=production
COPY package.json bun.lock pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN bun install --frozen-lockfile

FROM oven/bun:1.2.2 AS release

COPY --from=base /app/node_modules node_modules
# RUN pnpm install
# RUN npm install --legacy-peer-deps
# RUN npm ci
# Copy the rest of the application code to the working directory
COPY . .

RUN bun run build

# Define the command to run the application
# CMD bun run start
EXPOSE 3000
CMD ["bun","build/index.js" ]