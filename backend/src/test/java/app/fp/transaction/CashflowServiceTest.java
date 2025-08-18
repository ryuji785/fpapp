package app.fp.transaction;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CashflowServiceTest {

    @Mock
    TransactionMapper transactionMapper;

    @Test
    void calculatesMonthlySummary() {
        CashflowService service = new CashflowService(transactionMapper);
        CashflowSummary summary = new CashflowSummary();
        summary.setIncome(new BigDecimal("1000"));
        summary.setExpense(new BigDecimal("500"));
        summary.setSavings(new BigDecimal("100"));
        YearMonth ym = YearMonth.of(2024, 1);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        when(transactionMapper.sumByType(1L, start, end)).thenReturn(summary);

        CashflowSummary result = service.getMonthlySummary(1L, ym);

        assertEquals(new BigDecimal("1000"), result.getIncome());
        assertEquals(new BigDecimal("500"), result.getExpense());
        assertEquals(new BigDecimal("100"), result.getSavings());
    }
}
