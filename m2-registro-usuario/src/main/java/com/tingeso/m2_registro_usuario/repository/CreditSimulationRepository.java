package com.tingeso.m2_registro_usuario.repository;

import com.tingeso.m2_registro_usuario.model.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditSimulationRepository extends JpaRepository<Credit, Integer> {
}
