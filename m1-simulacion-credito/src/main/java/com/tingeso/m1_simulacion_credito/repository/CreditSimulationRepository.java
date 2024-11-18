package com.tingeso.m1_simulacion_credito.repository;

import com.tingeso.m1_simulacion_credito.model.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditSimulationRepository extends JpaRepository<Credit, Integer> {
}
