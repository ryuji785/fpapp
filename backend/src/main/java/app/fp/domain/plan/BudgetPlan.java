package app.fp.domain.plan;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Data;

@Data
public class BudgetPlan {
    private UUID id;
    private String title;
    private BigDecimal totalAmount;
}
