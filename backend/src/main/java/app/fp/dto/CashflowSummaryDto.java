package app.fp.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CashflowSummaryDto {
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal savings;
}
