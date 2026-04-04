# Use a stable Node.js runtime
FROM node:18

WORKDIR /app

# Copy all files
COPY . .

# Install root dependencies (frontend)
RUN npm install

# Build the frontend
RUN npm run build

# Install server dependencies
RUN npm install --prefix server --omit=dev --legacy-peer-deps

# Expose the standard Cloud Run port
ENV PORT=8080
EXPOSE 8080

# Start the server (which serves the dist folder)
CMD ["npm", "start"]
