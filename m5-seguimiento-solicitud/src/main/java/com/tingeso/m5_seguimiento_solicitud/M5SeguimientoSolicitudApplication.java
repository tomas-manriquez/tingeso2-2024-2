package com.tingeso.m5_seguimiento_solicitud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class M5SeguimientoSolicitudApplication {

	public static void main(String[] args) {
		SpringApplication.run(M5SeguimientoSolicitudApplication.class, args);
	}

}
