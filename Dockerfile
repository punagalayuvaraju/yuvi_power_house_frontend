FROM node:18-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Install Angular CLI and HTTP server globally
RUN npm install -g http-server

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install -f

# Copy the rest of the application code to the container
COPY --chown=node:node . .

# Build the Angular application
RUN npm run build --configuration=production

# Copy the contents of the "dist" folder (your build output) to the container's "/app" directory
RUN cp -R dist/task-management /home/node/app

# Expose the port on which the Angular app will run (default is 80)
EXPOSE 4000

# Start a simple HTTP server to serve the static files from the build folder
CMD ["http-server", "dist/task-management", "-p", "4000"]