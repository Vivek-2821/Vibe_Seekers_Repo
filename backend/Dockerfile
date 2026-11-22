# Build Stage
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY settings.xml /root/.m2/settings.xml
COPY pom.xml .
RUN mvn dependency:resolve dependency:resolve-plugins -B \
    -Dmaven.wagon.http.retryHandler.count=5 \
    -Dhttp.keepAlive=false \
    -Dmaven.wagon.http.pool=false
COPY src ./src
RUN mvn clean package -DskipTests -o -B || mvn clean package -DskipTests -B \
    -Dmaven.wagon.http.retryHandler.count=5 \
    -Dhttp.keepAlive=false \
    -Dmaven.wagon.http.pool=false

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /var/data/uploads && chown -R appuser:appgroup /var/data
COPY --from=builder /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
