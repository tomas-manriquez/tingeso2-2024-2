package com.tingeso.m2_registro_usuario.controller;

import com.tingeso.m2_registro_usuario.model.Credit;
import com.tingeso.m2_registro_usuario.service.CreditSimulationService;
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
