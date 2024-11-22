package com.tingeso.m2_registro_usuario.controller;

import com.tingeso.m2_registro_usuario.model.Credit;
import com.tingeso.m2_registro_usuario.service.CreditSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simulation")
//@CrossOrigin("*")
public class CreditSimulationController {
    @Autowired
    CreditSimulationService creditSimulationService;

    @PostMapping("/")
    public ResponseEntity<Double> simulation(@RequestBody Credit credit) {
        return ResponseEntity.ok(creditSimulationService.creditSimulation(credit));
    }

    @GetMapping("/example")
    public String example() {return "test de m2-registro-usuario";}
}
