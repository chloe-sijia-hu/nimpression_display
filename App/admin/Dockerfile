# FROM node:18
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# # RUN npm install
# COPY . .

# EXPOSE 5174
# # Use the preview command to serve the built app
# # CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5174"]
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
# frontend dockerfile:
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# Install dependecies
RUN npm ci

# Copy the rest of the application code
COPY . .

# increase the memory limit by setting an environment variable 
ENV NODE_OPTIONS=--max_old_space_size=4096


# Build the React app for production
RUN npm run build

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 5174

# Serve the app
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

