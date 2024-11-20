FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} actula-registro-usuario.jar
ENTRYPOINT ["java","-jar","/actual-registro-usuario.jar"]