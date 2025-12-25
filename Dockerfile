FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

