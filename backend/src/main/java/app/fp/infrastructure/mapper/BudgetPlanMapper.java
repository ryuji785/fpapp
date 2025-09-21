package app.fp.infrastructure.mapper;

import java.util.List;
import java.util.UUID;

import app.fp.domain.plan.BudgetPlan;

public interface BudgetPlanMapper {
    BudgetPlan findById(UUID id);
    List<BudgetPlan> findAll();
    void insert(BudgetPlan plan);
    void delete(UUID id);
}
