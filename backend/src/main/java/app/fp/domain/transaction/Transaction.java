package app.fp.domain.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Transaction {
    private Long id;
    private Long householdId;
    private Long userId;
    private TransactionType type;
    private Long categoryId;
    private BigDecimal amount;
    private LocalDate occurredDate;
    private Long paymentMethodId;
    private Long cardId;
    private String emoneyType;
    private Long accountId;
    private Long fromAccountId;
    private Long toAccountId;
    private String memo;
    private String receiptPath;
    private LocalDateTime createdAt;
}
