FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Utilisation de --host pour exposer le serveur Vite à l'extérieur du conteneur
CMD ["npm", "run", "dev", "--", "--host"]
