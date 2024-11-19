package com.tingeso.m3_solicitud_credito.controller;

import com.tingeso.m3_solicitud_credito.entity.CreditEntity;
import com.tingeso.m3_solicitud_credito.service.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/credit-request/credit")
@CrossOrigin("*")
public class CreditController {
    @Autowired
    CreditService creditService;

    @GetMapping("/{id}")
    public CreditEntity findById(@PathVariable Long id) {return creditService.findById(id);}

    @PostMapping("/save")
    public CreditEntity save(@RequestBody CreditEntity credit) {return creditService.save(credit);}

}
