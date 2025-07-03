# Stage 1: Base Image
FROM node:18-alpine

# Stage 2: Set Working Directory
WORKDIR /app

# Stage 3: Copy package files and Install Dependencies
COPY package*.json ./
RUN npm install

# Stage 4: Copy Application Code
COPY . .

# Stage 5: Expose Port
EXPOSE 5000

# Stage 6: Define Start Command
CMD ["npm", "start"]