# Dockerfile for the server
FROM node:20-alpine3.20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Expose the port the server runs on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]