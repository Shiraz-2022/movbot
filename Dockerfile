# Use lightweight Node.js image
FROM node
# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose WebSocket port
EXPOSE 3000

# Start the server using production script
ENTRYPOINT ["npx", "cross-env", "NODE_ENV=production", "tsx", "src/app.ts"]
