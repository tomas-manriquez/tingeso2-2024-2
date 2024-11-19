package com.tingeso.m4_evaluacion_credito.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

//Financial Evaluation Entity
@Entity
@Table(name= "fin_eval_entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinEval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long finEvalId;
    private Long userId;
    //State: "E1" hasta "E9" segun enunciado
    private String status;
    @ElementCollection
    private List<Long> documentsIds;
    private boolean hasSufficientDocuments;
    private Long monthlyCreditFee;
    private Long monthlyClientIncome;
    private Boolean hasGoodCreditHistory;
    //en meses (!)
    private Integer currentJobAntiquity;
    private Boolean isSelfEmployed;
    private Boolean hasGoodIncomeHistory;
    private Long monthlyDebt;
    //Para P4.R7.R74
    private Long bankAccountBalance;
    //Para P4.R7.R72
    private Long biggestWithdrawalInLastYear;
    //Para P4.R7.R73
    private Long totalDepositsInLastYear;
    //Para P4.R7.R74
    private Integer bankAccountAge;                     //en años(!)
    //Para P4.R7.R75
    private Long biggestWithdrawalInLastSemester;
}
