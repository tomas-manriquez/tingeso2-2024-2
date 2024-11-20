package com.tingeso.m6_calculo_costos_totales.service;

import com.tingeso.m6_calculo_costos_totales.clients.SimulationFeignClient;
import com.tingeso.m6_calculo_costos_totales.model.Credit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TotalCostCalcService {
    SimulationFeignClient simulationFeignClient;

    @Autowired
    public TotalCostCalcService(SimulationFeignClient simulationFeignClient)
    {
        this.simulationFeignClient = simulationFeignClient;
    }

    // Total Costs Calculator
    public double totalCostCalculation(Credit credit) {
        double result = monthlyCost(credit);
        for(int i=0;i < credit.getTotalFees().size(); i++)
        {
            if (credit.getTotalFees().get(i) %1 == 0) //valor es entero
            {
                result = result + credit.getTotalFees().get(i);
            }
            else //valor es porcentaje
            {
                double aux =  (result * credit.getTotalFees().get(i));
                result = result + aux;
            }
        }
        return result;
    }

    public double monthlyCost(Credit credit) {
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
