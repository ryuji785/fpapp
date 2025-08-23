package app.fp.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Data;

@Data
public class BudgetPlanDto {
    private UUID id;
    private String title;
    private BigDecimal totalAmount;
}
