#Descargar imagen desde Docker Hub
FROM openjdk:17

#Pasar .jar de disco a la imagen
ARG JAR_FILE=target/config-server-0.0.1-SNAPSJOT.jar
COPY ${JAR_FILE} config-server.jar

#Pasar instruccion para correr el ejecutable, lo mismo que cualquier .jar
ENTRYPOINT ["java", "-jar", "/config-server.jar"]