FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} m5-seguimiento-solicitud.jar
ENTRYPOINT ["java","-jar","m5-seguimiento-solicitud.jar"]