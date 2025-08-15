# Étape 1: Partir d'une image Node.js officielle et légère
FROM node:18-alpine

# Étape 2: Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3: Copier les fichiers de dépendances pour utiliser le cache Docker
COPY package.json ./
COPY package-lock.json ./

# Étape 4: Installer uniquement les dépendances de production
RUN npm install --production

# Étape 5: Copier tout le code de l'application
COPY . .

# ==============================================================
# === CAMÉRA DE SURVEILLANCE : On vérifie les fichiers copiés ===
# ==============================================================
# Cette commande va lister tous les fichiers dans /app pour PROUVER
# que server.js est bien là.
RUN ls -la
# ==============================================================

# Étape 6: Indiquer que le conteneur écoutera sur le port 5000
EXPOSE 5000

# Étape 7: Commande pour démarrer l'application
CMD [ "node", "server.js" ]