package com.tingeso.m5_seguimiento_solicitud.clients;

import com.tingeso.m5_seguimiento_solicitud.config.FeignClientConfig;
import com.tingeso.m5_seguimiento_solicitud.model.FinEval;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "m3-solicitud-credito",
        path = "/credit-request",
        configuration = {FeignClientConfig.class})
public interface FinEvalFeignClient {
    @GetMapping("/{id}")
    FinEval findById(@PathVariable Long id);
}
