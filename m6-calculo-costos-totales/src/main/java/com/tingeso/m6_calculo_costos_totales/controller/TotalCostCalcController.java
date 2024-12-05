package com.tingeso.m6_calculo_costos_totales.controller;

import com.tingeso.m6_calculo_costos_totales.model.Credit;
import com.tingeso.m6_calculo_costos_totales.service.TotalCostCalcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/total-cost-calc")
//@CrossOrigin("*")
public class TotalCostCalcController {
    @Autowired
    TotalCostCalcService totalCostCalcService;

    @GetMapping("/example")
    public String example() {return "test de m6-calculo-costos-totales";}

    @PostMapping("/calc")
    public Double totalCostCalculation(@RequestBody Credit credit) {return totalCostCalcService.totalCostCalculation(credit);}
}
