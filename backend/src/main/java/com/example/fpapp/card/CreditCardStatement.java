package com.example.fpapp.card;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "card_statements")
@Data
@NoArgsConstructor
public class CreditCardStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardName;

    private String month;

    private LocalDate closingDate;

    private LocalDate paymentDue;

    @ElementCollection
    @CollectionTable(name = "card_statement_items", joinColumns = @JoinColumn(name = "statement_id"))
    private List<StatementItem> items;

    @Embeddable
    @Data
    @NoArgsConstructor
    public static class StatementItem {
        private LocalDate date;
        private String description;
        private Double amount;
    }
}
