# Dockerfile for the client
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the client runs on
EXPOSE 5500

# Start the client in development mode
CMD ["npm", "run", "dev"]
