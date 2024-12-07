FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} actual-registro-usuario.jar
ENTRYPOINT ["java","-jar","/actual-registro-usuario.jar"]