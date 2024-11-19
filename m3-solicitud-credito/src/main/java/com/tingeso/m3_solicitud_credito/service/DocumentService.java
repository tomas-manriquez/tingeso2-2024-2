package com.tingeso.m3_solicitud_credito.service;

import com.tingeso.m3_solicitud_credito.entity.DocumentEntity;
import com.tingeso.m3_solicitud_credito.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.Optional;

@Service
public class DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    public DocumentEntity findById(Long id) {return documentRepository.findById(id).orElse(null);}
    //public DocumentEntity save(DocumentEntity documentEntity) {return documentRepository.save(documentEntity);}


    // Method to store a file
    public DocumentEntity save(MultipartFile file) throws IOException {
        DocumentEntity document = new DocumentEntity();
        document.setName(file.getOriginalFilename()); // Use original filename as name
        document.setType(file.getContentType());      // Use content type as type
        document.setFile(file.getBytes());            // Convert MultipartFile to byte array
        return documentRepository.save(document);
    }

    public DocumentEntity retrieveFile(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id " + documentId));
    }
}
