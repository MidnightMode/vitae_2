# Use official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that Cloud Run will use
EXPOSE 8080

# Run the app using npm
CMD [ "npm", "start" ]
