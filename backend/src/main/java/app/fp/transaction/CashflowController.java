package app.fp.transaction;

import java.time.YearMonth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.fp.dto.CashflowSummaryDto;

@RestController
public class CashflowController {
    private final CashflowService cashflowService;
    private final CashflowMapper cashflowMapper;

    public CashflowController(CashflowService cashflowService, CashflowMapper cashflowMapper) {
        this.cashflowService = cashflowService;
        this.cashflowMapper = cashflowMapper;
    }

    @GetMapping("/api/cashflow/monthly")
    public CashflowSummaryDto monthly(@RequestParam Long householdId, @RequestParam String month) {
        YearMonth ym = YearMonth.parse(month);
        return cashflowMapper.toDto(cashflowService.getMonthlySummary(householdId, ym));
    }
}
