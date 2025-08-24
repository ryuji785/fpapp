package app.fp.domain.repository;

import java.time.LocalDate;
import java.util.List;

import app.fp.domain.transaction.CashflowSummary;
import app.fp.domain.transaction.Transaction;

public interface TransactionRepository {
    void save(Transaction transaction);
    List<Transaction> findByHouseholdAndPeriod(Long householdId, LocalDate startDate, LocalDate endDate);
    CashflowSummary sumByType(Long householdId, LocalDate startDate, LocalDate endDate);
}
