package app.fp.config;

import java.util.Arrays;
import java.util.Objects;

import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationState;
import org.flywaydb.core.api.exception.FlywayException;
import org.slf4j.MDC;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class FlywayMigrationValidationConfig {

    @Bean
    public ApplicationRunner flywayValidationRunner(Flyway flyway) {
        return args -> {
            String traceId = currentTraceId();
            try {
                flyway.validate();
                boolean hasIncompleteMigration = Arrays.stream(flyway.info().all())
                        .filter(Objects::nonNull)
                        .map(MigrationInfo::getState)
                        .anyMatch(state -> MigrationState.FAILED == state || MigrationState.PENDING == state);

                if (hasIncompleteMigration) {
                    log.error("event=flywayValidation status=FAILED traceId={} message=pending_or_failed_migration_detected", traceId);
                    throw new IllegalStateException("Pending or failed Flyway migrations detected.");
                }

                log.info("event=flywayValidation status=SUCCESS traceId={}", traceId);
            } catch (FlywayException ex) {
                log.error("event=flywayValidation status=FAILED traceId={} message=\"{}\"", traceId, ex.getMessage(), ex);
                throw ex;
            }
        };
    }

    private String currentTraceId() {
        String traceId = MDC.get("traceId");
        return traceId != null ? traceId : "NA";
    }
}
