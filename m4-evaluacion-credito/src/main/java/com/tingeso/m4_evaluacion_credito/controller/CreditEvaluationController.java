package com.tingeso.m4_evaluacion_credito.controller;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/credit-eval")
@CrossOrigin("*")
public class CreditEvaluationController {
    @GetMapping("/example")
    public String example() {return "test de m3-solicitud-credito";}


}
