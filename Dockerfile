FROM node:22   

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy only source files, excluding node_modules and build artifacts
COPY . .

# Alternatively, for better caching and smaller images, you can use:
# COPY . .
# And add a .dockerignore file with:
# node_modules
# dist
# *.log

RUN npm i -g tsc 
RUN npm run build
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]