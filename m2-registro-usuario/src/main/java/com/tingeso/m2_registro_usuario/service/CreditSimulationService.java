package com.tingeso.m2_registro_usuario.service;

import com.tingeso.m2_registro_usuario.repository.CreditSimulationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CreditSimulationService {
    @Autowired
    CreditSimulationRepository creditSimulationRepository;

    public Long creditSimulation()
    {
        //TODO capturar datos de entrada como un Credito
        return 0L;
    }
}
