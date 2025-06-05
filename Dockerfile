# 1. Start from official Node.js 22 image
FROM node:22-slim

# 2. Set working directory inside container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json (if present), then install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the source code
COPY . .

# 5. Build TypeScript to JavaScript (outputs to ./dist)
RUN npm run build

# 6. Start the application
CMD ["npm", "run", "start"]
