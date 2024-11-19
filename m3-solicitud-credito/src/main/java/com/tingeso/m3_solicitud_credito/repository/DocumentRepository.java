package com.tingeso.m3_solicitud_credito.repository;

import com.tingeso.m3_solicitud_credito.entity.DocumentEntity;
import com.tingeso.m3_solicitud_credito.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long>{
}
