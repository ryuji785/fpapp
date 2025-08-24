package app.fp.application.cashflow;

import java.time.LocalDate;
import java.time.YearMonth;

import org.springframework.stereotype.Service;

import app.fp.domain.repository.TransactionRepository;
import app.fp.domain.transaction.CashflowSummary;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CashflowService {
    private final TransactionRepository transactionRepository;

    public CashflowService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public CashflowSummary getMonthlySummary(Long householdId, YearMonth month) {
        log.info("Calculating cashflow for household {} month {}", householdId, month);
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        CashflowSummary summary = transactionRepository.sumByType(householdId, start, end);
        log.info("Cashflow summary calculated: {}", summary);
        return summary;
    }
}
