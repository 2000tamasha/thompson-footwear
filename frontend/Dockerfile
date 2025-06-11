# Use Node.js official image
FROM node:18 AS build

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire frontend project
COPY . .

# Build the React app
RUN npm run build

# Serve the build with a lightweight web server
FROM node:18

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy build files from previous stage
COPY --from=build /app/build ./build

# Set the command to run the app
CMD ["serve", "-s", "build"]

# Expose the default serve port
EXPOSE 3000
