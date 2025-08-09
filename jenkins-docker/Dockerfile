FROM jenkins/jenkins:lts

USER root

# Installer les dépendances nécessaires, incluant sudo, git et Docker CLI
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release sudo git && \
    rm -rf /var/lib/apt/lists/*

# Installer Docker CLI
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# Installer Docker Compose comme plugin
RUN mkdir -p /usr/local/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-linux-$(uname -m) -o /usr/local/lib/docker/cli-plugins/docker-compose && \
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Ajouter Jenkins au groupe docker et configurer sudo
RUN groupadd -f docker && usermod -aG docker jenkins && \
    echo "jenkins ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/jenkins && \
    chmod 0440 /etc/sudoers.d/jenkins

USER jenkins

# Vérifier les installations (pour débogage)
RUN docker --version && \
    docker compose version || true