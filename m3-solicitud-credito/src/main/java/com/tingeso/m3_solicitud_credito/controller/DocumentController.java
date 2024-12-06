package com.tingeso.m3_solicitud_credito.controller;

import com.tingeso.m3_solicitud_credito.entity.DocumentEntity;
import com.tingeso.m3_solicitud_credito.entity.FinEvalEntity;
import com.tingeso.m3_solicitud_credito.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/credit-request/doc")
//@CrossOrigin("*")
public class DocumentController {
    @Autowired
    DocumentService documentService;


    /**
     * Endpoint to upload a document for a specific financial evaluation
     *
     * @param file The PDF or document file to upload
     * @param finEvalId The ID of the financial evaluation
     * @return ResponseEntity with the saved DocumentEntity
     */
    @PostMapping("/upload/{finEvalId}")
    public ResponseEntity<?> uploadFinancialEvaluationDocument(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long finEvalId
    ) {
        try {
            // Validate file is not empty
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File cannot be empty");
            }

            // Save the document
            DocumentEntity savedDocument = documentService.saveFinancialEvaluationDocument(file, finEvalId);

            // Return successful response with saved document
            return ResponseEntity.ok(savedDocument);

        } catch (IOException e) {
            // Handle file processing errors
            return ResponseEntity.internalServerError().body("Error processing file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            // Handle validation errors
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentEntity> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long finEvalId
    ) throws IOException {
        DocumentEntity savedDocument = documentService.saveDocument(file, userId, finEvalId);
        if(userId !=null){
        }
        return ResponseEntity.ok(savedDocument);
    }

    /**
     * Endpoint to upload multiple documents for a user
     *
     * @param files Array of files to upload
     * @param userId The ID of the user
     * @return ResponseEntity with list of saved DocumentEntities
     */
    @PostMapping("/upload/user/multiple/{userId}/")
    public ResponseEntity<?> uploadMultipleUserDocuments(
            @RequestParam("files") MultipartFile[] files,
            @PathVariable Long userId
    ) {
        try {
            // Save multiple documents
            List<DocumentEntity> savedDocuments = documentService.saveMultipleDocuments(files, userId, null);

            // Return successful response with saved documents
            return ResponseEntity.ok(savedDocuments);

        } catch (IOException e) {
            // Handle file processing errors
            return ResponseEntity.internalServerError().body("Error processing files: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            // Handle validation errors
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint to upload multiple documents for a financial evaluation
     *
     * @param files Array of files to upload
     * @param finEvalId The ID of the financial evaluation
     * @return ResponseEntity with list of saved DocumentEntities
     */
    @PostMapping("/upload/multiple/{finEvalId}")
    public ResponseEntity<?> uploadMultipleFinancialEvaluationDocuments(
            @RequestParam("files") MultipartFile[] files,
            @PathVariable Long finEvalId
    ) {
        try {
            // Save multiple documents
            List<DocumentEntity> savedDocuments = documentService.saveMultipleDocuments(files, null, finEvalId);

            // Return successful response with saved documents
            return ResponseEntity.ok(savedDocuments);

        } catch (IOException e) {
            // Handle file processing errors
            return ResponseEntity.internalServerError().body("Error processing files: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            // Handle validation errors
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    /**
     * Retrieve a document by its ID
     *
     * @param documentId The ID of the document to retrieve
     * @return ResponseEntity with the DocumentEntity
     */
    @GetMapping("/{documentId}")
    public DocumentEntity getDocument(@PathVariable Long documentId) {
        return documentService.findById(documentId);
    }

    /**
     * Delete a document by its ID
     *
     * @param documentId The ID of the document to delete
     * @return ResponseEntity indicating success or failure
     */
    @DeleteMapping("/delete/{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long documentId) {
        try {
            documentService.deleteById(documentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting document: " + e.getMessage());
        }
    }

    /**
     * Endpoint to retrieve multiple documents by their IDs
     *
     * @param documentIds List of document IDs to retrieve
     * @return ResponseEntity with list of DocumentEntity objects
     */
    @PostMapping("/bulk-retrieve")
    public ResponseEntity<?> getDocumentsByIds(@RequestBody List<Long> documentIds) {
        try {
            // Validate input
            if (documentIds == null || documentIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Document ID list cannot be null or empty");
            }

            // Retrieve documents
            List<DocumentEntity> documents =documentService.findDocumentsByIdIn(documentIds);

            // Return found documents
            return ResponseEntity.ok(documents);

        } catch (IllegalArgumentException e) {
            // Handle validation errors
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (DocumentNotFoundException e) {
            // Handle case where some documents are not found
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Handle any other unexpected errors
            return ResponseEntity.internalServerError().body("Error retrieving documents: " + e.getMessage());
        }
    }

    // Custom exception for document retrieval
    public static class DocumentNotFoundException extends RuntimeException {
        public DocumentNotFoundException(String message) {
            super(message);
        }
    }
}
