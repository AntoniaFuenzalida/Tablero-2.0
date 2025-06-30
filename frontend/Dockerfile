# Etapa 1: Compilar la aplicación
FROM node:20 AS build

# MOVER LOS ARGs AQUÍ, ANTES DEL BUILD
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_API_URL

# Convertirlos en ENV durante el build
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app

# Set npm configuration for better reliability
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm config set fetch-retry-factor 10
RUN npm config set fetch-retries 5

COPY package*.json ./
RUN npm install --no-optional --prefer-offline

COPY . .

RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copia el build al directorio por defecto de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# (Opcional) Config personalizado de Nginx si lo necesitas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
