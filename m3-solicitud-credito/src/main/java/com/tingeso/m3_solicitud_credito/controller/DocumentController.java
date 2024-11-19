package com.tingeso.m3_solicitud_credito.controller;

import com.tingeso.m3_solicitud_credito.entity.DocumentEntity;
import com.tingeso.m3_solicitud_credito.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/credit-request/doc")
@CrossOrigin("*")
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
}
