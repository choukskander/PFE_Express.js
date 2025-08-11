FROM jenkins/jenkins:lts

USER root

# Install curl and docker-compose
RUN apt-get update && apt-get install -y curl && \
    curl -SL https://github.com/docker/compose/releases/download/v2.39.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Install Docker CLI inside Jenkins
RUN apt-get install -y docker.io

# Add Jenkins user to Docker group
RUN usermod -aG docker jenkins

USER jenkins


# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . . 

# FROM node:18-alpine
# WORKDIR /app
# COPY --from=builder /app /app
# EXPOSE 5000
# ENV NODE_ENV=production
# CMD ["npm", "run", "dev"]