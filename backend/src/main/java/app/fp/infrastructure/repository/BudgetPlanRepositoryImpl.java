package app.fp.infrastructure.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import app.fp.domain.plan.BudgetPlan;
import app.fp.domain.repository.BudgetPlanRepository;
import app.fp.infrastructure.mapper.BudgetPlanMapper;

@Repository
public class BudgetPlanRepositoryImpl implements BudgetPlanRepository {
    private final BudgetPlanMapper mapper;

    public BudgetPlanRepositoryImpl(BudgetPlanMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Optional<BudgetPlan> findById(UUID id) {
        return Optional.ofNullable(mapper.findById(id));
    }

    @Override
    public List<BudgetPlan> findAll() {
        return mapper.findAll();
    }

    @Override
    public void save(BudgetPlan plan) {
        if (plan.getId() == null) {
            plan.setId(UUID.randomUUID());
        }
        mapper.insert(plan);
    }

    @Override
    public void delete(UUID id) {
        mapper.delete(id);
    }
}
