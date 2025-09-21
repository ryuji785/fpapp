package app.fp.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.fp.application.budget.BudgetPlanService;
import app.fp.dto.BudgetPlanDto;
import app.fp.web.mapper.BudgetPlanDtoMapper;

@RestController
@RequestMapping("/api/v1/budgets")
public class BudgetPlanController {
    private final BudgetPlanService service;
    private final BudgetPlanDtoMapper mapper;

    public BudgetPlanController(BudgetPlanService service, BudgetPlanDtoMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<BudgetPlanDto> getAll() {
        return service.findAll().stream().map(mapper::toDto).toList();
    }

    @PostMapping
    public void create(@RequestBody BudgetPlanDto dto) {
        service.create(mapper.toEntity(dto));
    }
}
