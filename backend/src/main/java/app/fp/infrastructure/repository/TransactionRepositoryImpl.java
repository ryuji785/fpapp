package app.fp.infrastructure.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Repository;

import app.fp.domain.repository.TransactionRepository;
import app.fp.domain.transaction.CashflowSummary;
import app.fp.domain.transaction.Transaction;
import app.fp.infrastructure.mapper.TransactionMapper;

@Repository
public class TransactionRepositoryImpl implements TransactionRepository {
    private final TransactionMapper mapper;

    public TransactionRepositoryImpl(TransactionMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void save(Transaction transaction) {
        mapper.insert(transaction);
    }

    @Override
    public List<Transaction> findByHouseholdAndPeriod(Long householdId, LocalDate startDate, LocalDate endDate) {
        return mapper.findByHouseholdAndPeriod(householdId, startDate, endDate);
    }

    @Override
    public CashflowSummary sumByType(Long householdId, LocalDate startDate, LocalDate endDate) {
        return mapper.sumByType(householdId, startDate, endDate);
    }
}
