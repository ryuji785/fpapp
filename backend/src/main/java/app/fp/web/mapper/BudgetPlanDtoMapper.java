package app.fp.web.mapper;

import org.mapstruct.Mapper;

import app.fp.domain.plan.BudgetPlan;
import app.fp.dto.BudgetPlanDto;

@Mapper(componentModel = "spring")
public interface BudgetPlanDtoMapper {
    BudgetPlanDto toDto(BudgetPlan plan);
    BudgetPlan toEntity(BudgetPlanDto dto);
}
