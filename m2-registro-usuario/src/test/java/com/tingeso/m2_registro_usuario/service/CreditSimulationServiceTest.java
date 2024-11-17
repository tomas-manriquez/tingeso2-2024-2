package com.tingeso.m2_registro_usuario.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
public class CreditSimulationServiceTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CreditSimulationService creditSimulationService;


}
