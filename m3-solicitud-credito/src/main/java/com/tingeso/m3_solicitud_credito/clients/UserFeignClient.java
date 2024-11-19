package com.tingeso.m3_solicitud_credito.clients;

import com.tingeso.m3_solicitud_credito.model.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "m3-solicitud-credito",
        path = "/register",
        configuration = {FeignClient.class})
public interface UserFeignClient {
    @GetMapping("/{id}")
    User findById(@PathVariable Long id);
}
