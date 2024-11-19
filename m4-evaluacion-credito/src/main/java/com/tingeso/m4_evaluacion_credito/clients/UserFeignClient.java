package com.tingeso.m4_evaluacion_credito.clients;

import com.tingeso.m4_evaluacion_credito.config.FeignClientConfig;
import com.tingeso.m4_evaluacion_credito.model.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(value = "actual-registro-usuario",
        path = "/register",
        configuration = {FeignClientConfig.class})
public interface UserFeignClient {
    @GetMapping("/{id}")
    User findById(@PathVariable Long id);
}
