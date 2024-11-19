package com.tingeso.actual_registro_usuario.repository;

import com.tingeso.actual_registro_usuario.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRegisterRepository extends JpaRepository<UserEntity, Long> {
}
