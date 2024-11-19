package com.tingeso.m3_solicitud_credito;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class M3SolicitudCreditoApplication {

	public static void main(String[] args) {
		SpringApplication.run(M3SolicitudCreditoApplication.class, args);
	}

}
