package com.tingeso.m4_evaluacion_credito;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class M4EvaluacionCreditoApplication {

	public static void main(String[] args) {
		SpringApplication.run(M4EvaluacionCreditoApplication.class, args);
	}

}
