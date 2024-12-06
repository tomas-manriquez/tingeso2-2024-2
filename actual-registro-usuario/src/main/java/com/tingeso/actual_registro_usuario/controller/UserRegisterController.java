package com.tingeso.actual_registro_usuario.controller;

import com.tingeso.actual_registro_usuario.entity.UserEntity;
import com.tingeso.actual_registro_usuario.service.UserRegisterService;
import org.apache.http.HttpEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/register")
//@CrossOrigin("*")
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

    @GetMapping("/all")
    public List<UserEntity> findAll(){ return userRegisterService.findAll(); }

    @DeleteMapping("/delete")
    public String delete(@RequestBody UserEntity user){ userRegisterService.delete(user); return "user deleted successfully"; }

    @PostMapping("/save")
    public UserEntity save(@RequestBody UserEntity user)
    {
        return userRegisterService.save(user);
    }
}
