# FROM jenkins/jenkins:lts

# USER root

# # Installer Docker CLI
# RUN apt-get update && \
#     apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
#     curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
#     echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
#     apt-get update && \
#     apt-get install -y docker-ce-cli && \
#     rm -rf /var/lib/apt/lists/*

# # Ajouter Jenkins à groupe docker
# RUN groupadd -f docker && usermod -aG docker jenkins

# USER jenkins
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 5000
ENV NODE_ENV=production
CMD ["npm", "run", "dev"]