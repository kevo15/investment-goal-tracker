package com.skillstorm.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationError(MethodArgumentNotValidException e) {
        
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach(
            error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            }
        );

        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("reason","Validation Errors");
        response.put("errors", errors);

        return ResponseEntity.status(400).body(response);

    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleErrorResponse(ResponseStatusException e) {
        
        HashMap<String, Object> errorObject = new HashMap<String, Object>();

        errorObject.put("status", e.getStatusCode().value());
        errorObject.put("reason", e.getReason());

        return ResponseEntity.status(e.getStatusCode()).body(errorObject);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Void> handleGeneralException(Exception e) {
        return ResponseEntity.status(404).body(null);
    }
    
}
