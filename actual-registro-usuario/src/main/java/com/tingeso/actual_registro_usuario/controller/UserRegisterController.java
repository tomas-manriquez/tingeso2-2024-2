package com.tingeso.actual_registro_usuario.controller;

import com.tingeso.actual_registro_usuario.entity.UserEntity;
import com.tingeso.actual_registro_usuario.service.UserRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@CrossOrigin("*")
public class UserRegisterController {
    @Autowired
    UserRegisterService userRegisterService;

    @GetMapping("/example")
    public String example() {return "test de actual-registro-usuario";}

    @PostMapping("/")
    public UserEntity register(@RequestBody UserEntity user)
    {
        return userRegisterService.userRegister(user);
    }

    @GetMapping("/{id}")
    public UserEntity findById(@PathVariable Long id){ return userRegisterService.findById(id); }
}
