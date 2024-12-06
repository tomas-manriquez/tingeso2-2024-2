package com.tingeso.m3_solicitud_credito.clients;

import com.tingeso.m3_solicitud_credito.config.FeignClientConfig;
import com.tingeso.m3_solicitud_credito.model.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "actual-registro-usuario",
        path = "/register",
        configuration = {FeignClientConfig.class})
public interface UserFeignClient {
    @GetMapping("/{id}")
    User findById(@PathVariable Long id);

    @PostMapping("/save")
    public User save(@RequestBody User user);
}
