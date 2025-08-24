package app.fp.domain.plan;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Data;

@Data
public class ExpenseItem {
    private UUID id;
    private String name;
    private BigDecimal amount;
}
