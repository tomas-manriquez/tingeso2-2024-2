package com.tingeso.m3_solicitud_credito.repository;

import com.tingeso.m3_solicitud_credito.entity.CreditEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditRepository extends JpaRepository<CreditEntity, Long> {
}
