package app.fp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("app.fp")
public class FpApplication {
    public static void main(String[] args) {
        SpringApplication.run(FpApplication.class, args);
    }
}
