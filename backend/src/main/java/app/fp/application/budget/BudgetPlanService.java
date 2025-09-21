package app.fp.application.budget;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.fp.domain.plan.BudgetPlan;
import app.fp.domain.repository.BudgetPlanRepository;

@Service
public class BudgetPlanService {
    private final BudgetPlanRepository repository;

    public BudgetPlanService(BudgetPlanRepository repository) {
        this.repository = repository;
    }

    public List<BudgetPlan> findAll() {
        return repository.findAll();
    }

    @Transactional
    public void create(BudgetPlan plan) {
        repository.save(plan);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(id);
    }
}
