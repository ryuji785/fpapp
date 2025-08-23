package app.fp.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import app.fp.domain.plan.BudgetPlan;

public interface BudgetPlanRepository {
    Optional<BudgetPlan> findById(UUID id);
    List<BudgetPlan> findAll();
    void save(BudgetPlan plan);
    void delete(UUID id);
}
