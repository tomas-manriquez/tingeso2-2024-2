package com.tingeso.m3_solicitud_credito.service;

import com.tingeso.m3_solicitud_credito.clients.UserFeignClient;
import com.tingeso.m3_solicitud_credito.entity.DocumentEntity;
import com.tingeso.m3_solicitud_credito.model.User;
import com.tingeso.m3_solicitud_credito.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private UserFeignClient userFeignClient;

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
        DocumentEntity savedDoc = documentRepository.save(document);

        if(userId != null) {
            // Retrieve the user via Feign client
            User user = userFeignClient.findById(userId);

            // If documentsIds is null, initialize it
            if (user.getDocumentsIds() == null) {
                user.setDocumentsIds(new ArrayList<>());
            }

            // Add the new document ID to the list
            user.getDocumentsIds().add(savedDoc.getId());

            // Save the updated user via Feign client
            userFeignClient.save(user);
        }
        return savedDoc;
    }

    /**
     * Comprehensive method to save multiple documents with validation
     *
     * @param files MultipartFiles to save
     * @param userId User ID (optional, can be null)
     * @param finEvalId Financial Evaluation ID (optional, can be null)
     * @return List of saved DocumentEntity objects
     * @throws IOException If there's an error processing the files
     */
    public List<DocumentEntity> saveMultipleDocuments(
            MultipartFile[] files,
            Long userId,
            Long finEvalId
    ) throws IOException {
        // Validate input
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("No files provided");
        }

        // Validate either userId or finEvalId is provided
        if (userId == null && finEvalId == null) {
            throw new IllegalArgumentException("Either userId or finEvalId must be provided");
        }

        List<DocumentEntity> savedDocuments = new ArrayList<>();

        // Process and save each file
        for (MultipartFile file : files) {
            // Validate individual file
            validateFile(file);

            DocumentEntity document = new DocumentEntity();

            // Set basic document properties
            document.setName(file.getOriginalFilename());
            document.setType(file.getContentType());

            // Set either userId or finEvalId
            if (userId != null) {
                document.setUserId(userId);
            } else {
                document.setFinEvalId(finEvalId);
            }

            // Convert MultipartFile to byte array
            document.setFile(file.getBytes());

            // Save the document
            DocumentEntity savedDocument = documentRepository.save(document);
            savedDocuments.add(savedDocument);
        }

        return savedDocuments;
    }

    public DocumentEntity findById(Long id) {return documentRepository.findById(id).orElse(null);}

    public void deleteById(Long id) {documentRepository.deleteById(id); }

    public List<DocumentEntity> findDocumentsByIdIn(List<Long> documentIds) {return documentRepository.findAllById(documentIds);}
}