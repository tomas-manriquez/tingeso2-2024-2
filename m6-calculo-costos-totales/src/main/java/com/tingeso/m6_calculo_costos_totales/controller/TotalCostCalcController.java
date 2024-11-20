package com.tingeso.m6_calculo_costos_totales.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/total-cost-calc")
@CrossOrigin("*")
public class TotalCostCalcController {

    @GetMapping("/example")
    public String example() {return "test de m6-calculo-costos-totales";}
}
