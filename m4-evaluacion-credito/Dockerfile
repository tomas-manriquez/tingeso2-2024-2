FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} m4-evaluacion-credito.jar
ENTRYPOINT ["java","-jar","/m4-evaluacion-credito.jar"]