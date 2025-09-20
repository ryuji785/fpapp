package app.fp.presentation.health;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
@Slf4j
public class DatabaseHealthController {

    private final DataSource dataSource;

    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        String traceId = currentTraceId();
        try (Connection connection = dataSource.getConnection()) {
            if (!connection.isValid(2)) {
                throw new SQLException("Database connection is not valid");
            }
            log.info("event=databaseHealth status=UP traceId={}", traceId);
            return ResponseEntity.ok(Map.of("status", "UP"));
        } catch (Exception ex) {
            log.error("event=databaseHealth status=DOWN traceId={} message=\"{}\"", traceId, ex.getMessage());
            Map<String, Object> body = new HashMap<>();
            body.put("status", "DOWN");
            body.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
        }
    }

    private String currentTraceId() {
        String traceId = MDC.get("traceId");
        return traceId != null ? traceId : "NA";
    }
}
