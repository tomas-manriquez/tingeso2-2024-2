package com.tingeso.m3_solicitud_credito.controller;

import com.tingeso.m3_solicitud_credito.entity.DocumentEntity;
import com.tingeso.m3_solicitud_credito.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping("/{id}")
    public DocumentEntity findById(@PathVariable Long id) {return documentService.findById(id);}

    @PostMapping(value="/save", consumes = {"application/json"})
    public DocumentEntity save(@RequestBody MultipartFile file ) throws IOException {

        return documentService.save(file);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        try {
            DocumentEntity document = documentService.retrieveFile(id);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getType())) // MIME type from DocumentEntity
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getName() + "\"")
                    .body(document.getFile()); // File content as byte array
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
