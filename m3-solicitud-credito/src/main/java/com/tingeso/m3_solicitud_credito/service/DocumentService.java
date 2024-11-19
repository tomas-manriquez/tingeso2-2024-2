package com.tingeso.m3_solicitud_credito.service;

import com.tingeso.m3_solicitud_credito.entity.DocumentEntity;
import com.tingeso.m3_solicitud_credito.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    /**
     * Save a document from a MultipartFile for a specific user
     *
     * @param file The MultipartFile to be saved
     * @param userId The ID of the user associated with the document
     * @return The saved DocumentEntity
     * @throws IOException If there's an error reading the file
     */
    public DocumentEntity saveUserDocument(MultipartFile file, Long userId) throws IOException {
        DocumentEntity document = new DocumentEntity();

        // Set basic document properties
        document.setName(file.getOriginalFilename());
        document.setType(file.getContentType());
        document.setUserId(userId);

        // Convert MultipartFile to byte array
        document.setFile(file.getBytes());

        // Save and return the document
        return documentRepository.save(document);
    }

    /**
     * Save a document from a MultipartFile for a specific financial evaluation
     *
     * @param file The MultipartFile to be saved
     * @param finEvalId The ID of the financial evaluation associated with the document
     * @return The saved DocumentEntity
     * @throws IOException If there's an error reading the file
     */
    public DocumentEntity saveFinancialEvaluationDocument(MultipartFile file, Long finEvalId) throws IOException {
        DocumentEntity document = new DocumentEntity();

        // Set basic document properties
        document.setName(file.getOriginalFilename());
        document.setType(file.getContentType());
        document.setFinEvalId(finEvalId);

        // Convert MultipartFile to byte array
        document.setFile(file.getBytes());

        // Save and return the document
        return documentRepository.save(document);
    }

    /**
     * Validate file before saving
     *
     * @param file MultipartFile to validate
     * @throws IOException If validation fails
     */
    private void validateFile(MultipartFile file) throws IOException {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot save an empty file");
        }

        // Optional: Add more validations like file size, type, etc.
        // For example:
        long maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }

        // Optional: Validate file type
        String[] allowedTypes = {"application/pdf", "image/jpeg", "image/png"};
        boolean isValidType = false;
        for (String type : allowedTypes) {
            if (type.equals(file.getContentType())) {
                isValidType = true;
                break;
            }
        }
        if (!isValidType) {
            throw new IllegalArgumentException("Invalid file type");
        }
    }

    /**
     * Comprehensive method to save a document with validation
     *
     * @param file MultipartFile to save
     * @param userId User ID (optional, can be null)
     * @param finEvalId Financial Evaluation ID (optional, can be null)
     * @return The saved DocumentEntity
     * @throws IOException If there's an error processing the file
     */
    public DocumentEntity saveDocument(MultipartFile file, Long userId, Long finEvalId) throws IOException {
        // Validate the file first
        validateFile(file);

        DocumentEntity document = new DocumentEntity();

        // Set basic document properties
        document.setName(file.getOriginalFilename());
        document.setType(file.getContentType());

        // Set either userId or finEvalId
        if (userId != null) {
            document.setUserId(userId);
        } else if (finEvalId != null) {
            document.setFinEvalId(finEvalId);
        } else {
            throw new IllegalArgumentException("Either userId or finEvalId must be provided");
        }

        // Convert MultipartFile to byte array
        document.setFile(file.getBytes());

        // Save and return the document
        return documentRepository.save(document);
    }

    public DocumentEntity findById(Long id) {return documentRepository.findById(id).orElse(null);}
}