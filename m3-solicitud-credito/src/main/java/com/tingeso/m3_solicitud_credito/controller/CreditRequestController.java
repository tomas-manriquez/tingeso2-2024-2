package com.tingeso.m3_solicitud_credito.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/credit-request")
@CrossOrigin("*")
public class CreditRequestController {

    @GetMapping("/example")
    public String example() {return "test de m3-solicitud-credito";}
}
