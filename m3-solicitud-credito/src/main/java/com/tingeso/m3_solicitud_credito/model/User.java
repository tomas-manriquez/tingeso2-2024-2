package com.tingeso.m3_solicitud_credito.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name= "user_entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long userId;

    private String rut;
    private String firstName;
    private String lastName;
    //birthday YYYY-MM-DD
    private String birthday;
    //'state' marca si esta en 'espera', 'validado'
    // o 'rechazado' como usuario
    private String status;

    @ElementCollection
    private List<Long> documentsIds;
    private boolean hasValidDocuments;
}
