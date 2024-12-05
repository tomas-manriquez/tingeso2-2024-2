package com.tingeso.m3_solicitud_credito.repository;

import com.tingeso.m3_solicitud_credito.entity.FinEvalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditRequestRepository extends JpaRepository<FinEvalEntity, Long> {
}
