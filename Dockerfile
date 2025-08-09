FROM node:18

# Installer les paquets nécessaires pour Docker CLI
RUN apt-get update && \
    apt-get install -y \
      ca-certificates \
      curl \
      gnupg \
      lsb-release && \
    mkdir -p /etc/apt/keyrings

# Ajouter la clé officielle Docker
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Configurer le dépôt Docker stable
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker CLI et Docker Compose plugin
RUN apt-get update && \
    apt-get install -y docker-ce-cli docker-compose-plugin && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
