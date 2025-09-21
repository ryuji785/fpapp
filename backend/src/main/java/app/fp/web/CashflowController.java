package app.fp.web;

import java.time.YearMonth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.fp.application.cashflow.CashflowService;
import app.fp.dto.CashflowSummaryDto;
import app.fp.web.mapper.CashflowMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
        log.info("Fetching cashflow summary for household {} month {}", householdId, month);
        YearMonth ym = YearMonth.parse(month);
        CashflowSummaryDto dto = cashflowMapper.toDto(cashflowService.getMonthlySummary(householdId, ym));
        log.info("Returning summary {}", dto);
        return dto;
    }
}
