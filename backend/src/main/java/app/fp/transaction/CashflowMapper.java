package app.fp.transaction;

import org.mapstruct.Mapper;

import app.fp.dto.CashflowSummaryDto;

@Mapper(componentModel = "spring")
public interface CashflowMapper {
    CashflowSummaryDto toDto(CashflowSummary summary);
}
