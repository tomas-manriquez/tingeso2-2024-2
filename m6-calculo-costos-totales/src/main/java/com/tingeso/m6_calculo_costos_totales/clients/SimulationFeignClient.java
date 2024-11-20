package com.tingeso.m6_calculo_costos_totales.clients;

import com.tingeso.m6_calculo_costos_totales.config.FeignClientConfig;
import com.tingeso.m6_calculo_costos_totales.model.Credit;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "m2-registro-usuario",
        path = "/simulation",
        configuration = {FeignClientConfig.class})
public interface SimulationFeignClient {

    @GetMapping("/")
    double simulation(@RequestBody Credit credit);
}
