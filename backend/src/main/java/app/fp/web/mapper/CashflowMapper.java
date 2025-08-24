package app.fp.web.mapper;

import org.mapstruct.Mapper;

import app.fp.domain.transaction.CashflowSummary;
import app.fp.dto.CashflowSummaryDto;

@Mapper(componentModel = "spring")
public interface CashflowMapper {
    CashflowSummaryDto toDto(CashflowSummary summary);
}
