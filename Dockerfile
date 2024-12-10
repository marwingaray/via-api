# Usar una imagen base oficial de Node.js con una versión específica
FROM node:20-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /src

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Variable de entorno para producción
ENV NODE_ENV=production

# Puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "app.js"]