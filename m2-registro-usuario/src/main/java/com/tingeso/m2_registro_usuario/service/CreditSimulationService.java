package com.tingeso.m2_registro_usuario.service;

import com.tingeso.m2_registro_usuario.model.Credit;
import com.tingeso.m2_registro_usuario.repository.CreditSimulationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CreditSimulationService {
    @Autowired
    CreditSimulationRepository creditSimulationRepository;

    //sirve para P1 como para calcular cuota mensual de P6
    //Esta malo pero sirve por mientras
    public double creditSimulation(Credit credit) {
        double minInterestRate;
        double maxInterestRate;
        switch (credit.getType())
        {
            case "vivienda1":
                minInterestRate = 3.5;
                maxInterestRate = 5;
                break;
            case "vivienda2":
                minInterestRate = 4;
                maxInterestRate = 6;
                break;
            case "comercial":
                minInterestRate = 5;
                maxInterestRate = 7;
                break;
            case "remodelacion":
                minInterestRate = 4.5;
                maxInterestRate = 6;
                break;
            default:
                minInterestRate = credit.getAnnualInterestRate();
                maxInterestRate = credit.getAnnualInterestRate();
        }
        double averageInterestRate = (minInterestRate + maxInterestRate) / 2;
        double monthlyInterestRate = averageInterestRate / 12;
        return credit.getPropertyValue() * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, credit.getMaxPayTerm() * 12)) /
                (Math.pow(1 + monthlyInterestRate, credit.getMaxPayTerm() * 12) - 1);
    }
}
