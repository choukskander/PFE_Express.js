# Étape 1: Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier les fichiers de dépendances pour optimiser le cache de Docker
COPY package.json ./
COPY package-lock.json ./

# Installer les dépendances du projet
RUN npm install --production

# Copier tout le reste du code de l'application
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 5000

# La commande pour démarrer l'application quand le conteneur se lance
CMD [ "node", "server.js" ]