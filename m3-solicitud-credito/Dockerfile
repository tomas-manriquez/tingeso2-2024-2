FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} m3-solicitud-credito.jar
ENTRYPOINT ["java","-jar","/m3-solicitud-credito.jar"]