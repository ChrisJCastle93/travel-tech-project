# Use the specific Node.js version from your 'engines' in 'package.json'
FROM node:18.17.0

# Create the directory for the application inside the container
WORKDIR /app

# Copy the 'package.json' and 'package-lock.json' to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# If you need to build the Tailwind CSS as part of the setup, uncomment the following line:
# RUN npm run build:css

# Copy the rest of the project into the container
COPY . .

# The port your app will run on
EXPOSE 3000

# Command to run when starting the container
CMD [ "node", "./bin/www" ]
