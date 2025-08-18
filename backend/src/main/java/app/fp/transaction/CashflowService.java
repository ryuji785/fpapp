package app.fp.transaction;

import java.time.LocalDate;
import java.time.YearMonth;

import org.springframework.stereotype.Service;

@Service
public class CashflowService {
    private final TransactionMapper transactionMapper;

    public CashflowService(TransactionMapper transactionMapper) {
        this.transactionMapper = transactionMapper;
    }

    public CashflowSummary getMonthlySummary(Long householdId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return transactionMapper.sumByType(householdId, start, end);
    }
}
