#Descargar la imagen de nginx
FROM nginx:stable-alpine

#Buscar ejecutable de produccion en el disco duro local
COPY /dist usr/share/nginx/html
#COPY /nginx /etc/nginx/conf.d
COPY /nginx/frontend.conf /etc/nginx/conf.d/

#Exponer puerto 3000
EXPOSE 3000

#Pasar comando para correr el ejecutable
CMD ["nginx", "-g", "daemon off;"]
