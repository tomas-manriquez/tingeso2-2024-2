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
        double result = simulationFeignClient.simulation(credit);
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
}
