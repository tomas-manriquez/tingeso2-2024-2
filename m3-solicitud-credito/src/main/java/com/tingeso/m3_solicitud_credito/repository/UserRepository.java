package com.tingeso.m3_solicitud_credito.repository;

import com.tingeso.m3_solicitud_credito.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
