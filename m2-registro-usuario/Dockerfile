FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} m2-registro-usuario.jar
ENTRYPOINT ["java","-jar","/m2-registro-usuario.jar"]