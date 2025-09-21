package app.fp.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("app.fp.infrastructure.mapper")
public class MyBatisConfig {
}
