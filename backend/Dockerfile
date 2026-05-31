FROM node:latest

WORKDIR /usr/src/app

# Copy only package files first (better caching)
COPY package*.json ./

RUN npm ci

# Copy prisma schema FIRST (important)
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Remove dev dependencies (safe AFTER generate + copy)
RUN npm prune --production

EXPOSE 3000

CMD ["node", "src/app.js"]