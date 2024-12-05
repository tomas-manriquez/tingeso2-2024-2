package com.tingeso.m3_solicitud_credito.dto;

import com.tingeso.m3_solicitud_credito.entity.CreditEntity;
import com.tingeso.m3_solicitud_credito.entity.FinEvalEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditRequestWithCreditDTO {
    private FinEvalEntity finEval;
    private CreditEntity credits;
}