package app.fp.domain.payment;

import lombok.Data;

@Data
public class Account {
    private Long id;
    private Long householdId;
    private String name;
}
