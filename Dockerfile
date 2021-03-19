FROM node:lts-alpine

# Get env argument
ARG env
RUN echo "ENV :  $env"

# définit le dossier 'app' comme dossier de travail
WORKDIR ../app

# copie 'package.json' et 'package-lock.json' (si disponible)
COPY package*.json ./

# installe les dépendances du projet
RUN npm install

# copie les fichiers et dossiers du projet dans le dossier de travail (par exemple : le dossier 'app')
COPY . .

# construit l'app pour la production en la minifiant
RUN npm run build

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80

CMD [ "npm", "start" ]
