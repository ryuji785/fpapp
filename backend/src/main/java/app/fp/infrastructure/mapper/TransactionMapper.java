package app.fp.infrastructure.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import app.fp.domain.transaction.CashflowSummary;
import app.fp.domain.transaction.Transaction;

@Mapper
public interface TransactionMapper {
    List<Transaction> findByHouseholdAndPeriod(@Param("householdId") Long householdId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    CashflowSummary sumByType(@Param("householdId") Long householdId,
                              @Param("startDate") LocalDate startDate,
                              @Param("endDate") LocalDate endDate);

    int insert(Transaction transaction);
}
