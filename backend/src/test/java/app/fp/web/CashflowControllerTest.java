package app.fp.web;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.YearMonth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import app.fp.application.cashflow.CashflowService;
import app.fp.domain.transaction.CashflowSummary;
import app.fp.dto.CashflowSummaryDto;
import app.fp.web.mapper.CashflowMapper;

@WebMvcTest(CashflowController.class)
class CashflowControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CashflowService cashflowService;
    @MockBean
    private CashflowMapper cashflowMapper;

    @Test
    void returnsMonthlySummary() throws Exception {
        CashflowSummary summary = new CashflowSummary();
        summary.setIncome(new BigDecimal("1000"));
        summary.setExpense(new BigDecimal("500"));
        summary.setSavings(new BigDecimal("100"));

        CashflowSummaryDto dto = new CashflowSummaryDto();
        dto.setIncome(new BigDecimal("1000"));
        dto.setExpense(new BigDecimal("500"));
        dto.setSavings(new BigDecimal("100"));

        YearMonth ym = YearMonth.of(2024, 1);
        when(cashflowService.getMonthlySummary(1L, ym)).thenReturn(summary);
        when(cashflowMapper.toDto(summary)).thenReturn(dto);

        mockMvc.perform(get("/api/cashflow/monthly")
                .param("householdId", "1")
                .param("month", "2024-01"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.income").value(1000))
            .andExpect(jsonPath("$.expense").value(500))
            .andExpect(jsonPath("$.savings").value(100));
    }
}
