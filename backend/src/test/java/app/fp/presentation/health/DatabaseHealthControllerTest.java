package app.fp.presentation.health;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@TestMethodOrder(OrderAnnotation.class)
@ExtendWith(SpringExtension.class)
class DatabaseHealthControllerTest {

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("fpapp")
            .withUsername("fpapp")
            .withPassword("fpapp_secret");

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private DataSource dataSource;

    @DynamicPropertySource
    static void configureDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url", postgres::getJdbcUrl);
        registry.add("spring.flyway.user", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);
        registry.add("spring.datasource.hikari.connection-timeout", () -> "1000");
        registry.add("spring.datasource.hikari.validation-timeout", () -> "1000");
    }

    @Test
    @Order(1)
    void shouldReportUpWhenDatabaseReachable() {
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).containsEntry("status", "UP");
    }

    @Test
    @Order(2)
    void shouldReportDownWhenDatabaseBecomesUnavailable() {
        if (postgres.isRunning()) {
            postgres.stop();
        }
        if (dataSource instanceof HikariDataSource hikariDataSource) {
            hikariDataSource.getHikariPoolMXBean().softEvictConnections();
        }

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).containsEntry("status", "DOWN");
        assertThat(response.getBody()).containsKey("error");
    }

    private String url() {
        return "http://localhost:" + port + "/api/v1/health/db";
    }
}
