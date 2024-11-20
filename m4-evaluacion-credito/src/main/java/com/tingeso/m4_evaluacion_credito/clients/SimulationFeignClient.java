package com.tingeso.m4_evaluacion_credito.clients;

import com.tingeso.m4_evaluacion_credito.config.FeignClientConfig;
import com.tingeso.m4_evaluacion_credito.model.Credit;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "m2-registro-usuario",
        path = "/simulation",
        configuration = {FeignClientConfig.class})
public interface SimulationFeignClient {
    @GetMapping("/")
    Double simulation(@RequestBody Credit credit);
}
