package app.fp.transaction;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
