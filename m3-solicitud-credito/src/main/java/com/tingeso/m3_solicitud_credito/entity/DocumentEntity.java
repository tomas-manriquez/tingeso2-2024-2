package com.tingeso.m3_solicitud_credito.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="document_entity")
@Data

public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private String name;
    private String type;
    @Lob
    private byte[] file;
    //para Client
    private Long userId;
    //para Request
    private Long finEvalId;
}
