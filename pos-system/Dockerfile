# Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime (lighter)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/pos-system-0.0.1-SNAPSHOT.jar pos-system.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "pos-system.jar"]