package com.tingeso.m2_registro_usuario.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long creditId;
    //Financial eval
    private Long FinEvalId;
    private String type;
    private Integer maxPayTerm;             //years
    private Float annualInterestRate;
    private Float maxFinanceAmount;         //percentage
    private Long propertyValue;
    @ElementCollection
    private List<Float> totalFees;

}
