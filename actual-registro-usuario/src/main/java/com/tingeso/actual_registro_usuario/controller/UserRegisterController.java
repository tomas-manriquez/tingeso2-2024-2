package com.tingeso.actual_registro_usuario.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/register")
@CrossOrigin("*")
public class UserRegisterController {

    @GetMapping("/example")
    public String example() {return "test de actual-registro-usuario";}
}
