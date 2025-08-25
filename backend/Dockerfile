# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV DB_HOST=db
ENV DB_USER=root
ENV DB_PASSWORD=ejemplo
ENV DB_NAME=usuariosDB

# Comando para ejecutar la aplicación
CMD ["npm", "start"]