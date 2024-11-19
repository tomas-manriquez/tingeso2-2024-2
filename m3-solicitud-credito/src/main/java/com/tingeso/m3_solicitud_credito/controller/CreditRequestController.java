package com.tingeso.m3_solicitud_credito.controller;

import com.tingeso.m3_solicitud_credito.entity.CreditEntity;
import com.tingeso.m3_solicitud_credito.entity.FinEvalEntity;
import com.tingeso.m3_solicitud_credito.service.CreditRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/credit-request")
@CrossOrigin("*")
public class CreditRequestController {
    @Autowired
    CreditRequestService creditRequestService;

    @GetMapping("/example")
    public String example() {return "test de m3-solicitud-credito";}

    @PostMapping("/make/{userid}")
    public boolean makeRequest(@PathVariable Long userid, @RequestBody CreditEntity creditEntity)
    {
        return creditRequestService.makeRequest(userid, creditEntity);
    }

    @GetMapping("/{id}")
    public FinEvalEntity findById(@PathVariable Long id)
    {
        return creditRequestService.findById(id);
    }

    @PostMapping("/save")
    public FinEvalEntity save(@RequestBody FinEvalEntity finEvalEntity)
    {
        return creditRequestService.save(finEvalEntity);
    }
}
