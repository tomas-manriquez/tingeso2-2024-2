package com.tingeso.m3_solicitud_credito.controller;

import com.tingeso.m3_solicitud_credito.dto.CreditRequestWithCreditDTO;
import com.tingeso.m3_solicitud_credito.entity.CreditEntity;
import com.tingeso.m3_solicitud_credito.entity.FinEvalEntity;
import com.tingeso.m3_solicitud_credito.service.CreditRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.ResourceUrlProvider;

import java.util.List;

@RestController
@RequestMapping("/credit-request")
//@CrossOrigin("*")
public class CreditRequestController {
    @Autowired
    CreditRequestService creditRequestService;
    @Autowired
    private ResourceUrlProvider mvcResourceUrlProvider;

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

    @GetMapping("/all")
    public List<FinEvalEntity> findAll(){return creditRequestService.findAll();};

    @PostMapping("/save")
    public FinEvalEntity save(@RequestBody FinEvalEntity finEvalEntity)
    {
        return creditRequestService.save(finEvalEntity);
    }

    @DeleteMapping("/delete/{finEvalId}")
    public ResponseEntity<?> deleteById(@PathVariable Long finEvalId) {
        try {
            creditRequestService.deleteById(finEvalId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting document: " + e.getMessage());
        }
    }

    @GetMapping("/all/w-creds")
    public ResponseEntity<List<CreditRequestWithCreditDTO>> getAllCreditRequestsWithCredits() {
        List<CreditRequestWithCreditDTO> finEvals = creditRequestService.getAllCreditRequestsWithCredits();
        return ResponseEntity.ok(finEvals);
    }

    @GetMapping("/{id}/w-creds")
    public ResponseEntity<CreditRequestWithCreditDTO> getCreditRequestWithCreditDTO(@PathVariable Long id) {
        CreditRequestWithCreditDTO finEvals = creditRequestService.getCreditRequestWithCreditDTO(id);
        return ResponseEntity.ok(finEvals);
    }
}
