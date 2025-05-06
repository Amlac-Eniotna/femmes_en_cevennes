FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Créer les répertoires nécessaires avec les bonnes permissions
RUN mkdir -p /app/public/uploads /app/data
RUN chmod -R 777 /app/public/uploads /app/data

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer le serveur
CMD ["npm", "start"]