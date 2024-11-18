# Utilisation de l'image Node.js officielle
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./
COPY . .

# Installer les dépendances
RUN npm install

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "dev"]
