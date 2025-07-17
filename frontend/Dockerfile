# Estágio de build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copia o arquivo de configuração customizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
