package com.tingeso.m1_simulacion_credito.controller;

import com.tingeso.m1_simulacion_credito.model.Credit;
import com.tingeso.m1_simulacion_credito.service.CreditSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simulation")
@CrossOrigin("*")
public class CreditSimulationController {
    @Autowired
    CreditSimulationService creditSimulationService;

    @GetMapping("/get")
    public double simulation(@RequestBody Credit credit)
    {
        return creditSimulationService.creditSimulation(credit);
    }

    @GetMapping("/example")
    public String example() {return "test de m2-registro-usuario";}
}
