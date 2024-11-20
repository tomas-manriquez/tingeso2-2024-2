package com.tingeso.m2_registro_usuario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class M2RegistroUsuarioApplication {

	public static void main(String[] args) {
		SpringApplication.run(M2RegistroUsuarioApplication.class, args);
	}

}
