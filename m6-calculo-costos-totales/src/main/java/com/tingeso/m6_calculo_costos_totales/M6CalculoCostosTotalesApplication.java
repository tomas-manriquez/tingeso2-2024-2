package com.tingeso.m6_calculo_costos_totales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class M6CalculoCostosTotalesApplication {

	public static void main(String[] args) {
		SpringApplication.run(M6CalculoCostosTotalesApplication.class, args);
	}

}
