package com.tingeso.m4_evaluacion_credito.clients;

import com.tingeso.m4_evaluacion_credito.config.FeignClientConfig;
import com.tingeso.m4_evaluacion_credito.model.FinEval;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "m3-solicitud-credito",
        path = "/credit-request",
        configuration = {FeignClientConfig.class})
public interface FinEvalFeignClient {
    @GetMapping("/{id}")
    FinEval findById(@PathVariable Long id);

    @PostMapping("/save")
    FinEval save(@RequestBody FinEval finEvalEntity);
}