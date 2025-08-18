package app.fp.domain.payment;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Card {
    private Long id;
    private Long householdId;
    private String name;
    private BigDecimal limitAmount;
    private Integer closingDay;
    private Integer paymentDueDay;
}
