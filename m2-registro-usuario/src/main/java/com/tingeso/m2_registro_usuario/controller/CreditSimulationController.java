package com.tingeso.m2_registro_usuario.controller;

import com.tingeso.m2_registro_usuario.model.Credit;
import com.tingeso.m2_registro_usuario.service.CreditSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/simulation")
public class CreditSimulationController {
    @Autowired
    CreditSimulationService creditSimulationService;

    @GetMapping("/")
    public Long simulation(@RequestBody Credit credit)
    {
        return creditSimulationService.creditSimulation();
    }
}
