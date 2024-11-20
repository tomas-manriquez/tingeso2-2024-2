package com.tingeso.m4_evaluacion_credito.controller;


import com.tingeso.m4_evaluacion_credito.service.CreditEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/credit-eval")
@CrossOrigin("*")
public class CreditEvaluationController {
    @Autowired
    CreditEvaluationService creditEvaluationService;

    @GetMapping("/example")
    public String example() {return "test de m4-evaluacion-credito";}

    @GetMapping("/feign/{id}")
    public String feign(@PathVariable Long id) {
        creditEvaluationService.findByUserId(id);
        creditEvaluationService.findByFinEvalId(id);
        creditEvaluationService.findByCreditId(id);
        return "feign User + FinEval + Credit: exito";
    }
}
