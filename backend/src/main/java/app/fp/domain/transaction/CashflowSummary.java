package app.fp.domain.transaction;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CashflowSummary {
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal savings;
}
