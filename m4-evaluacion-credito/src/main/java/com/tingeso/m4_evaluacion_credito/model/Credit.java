package com.tingeso.m4_evaluacion_credito.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="credit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long creditId;
    //Financial eval
    private Long finEvalId;
    private String type;
    private Integer maxPayTerm;             //years
    private Double annualInterestRate;
    private Float maxFinanceAmount;         //percentage
    private Long propertyValue;             //Valor en CLP
    private Long requestedAmount;
    @ElementCollection
    private List<Float> totalFees;

}
