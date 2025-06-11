package br.com.sisaudcon.saam.saam_sped_cnd.exceptionhandler;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClienteNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleClienteNotFoundException(ClienteNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    @ExceptionHandler(EmpresaNotFoundException.class)
    public ResponseEntity<Object> handleEmpresaNotFound(EmpresaNotFoundException ex) {
        Map<String, String> errorBody = new HashMap<>();
        errorBody.put("error", "Empresa não encontrada no SAAM para o ID informado.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
    }
    @ExceptionHandler(ClienteVinculadoResultadoException.class)
    public ResponseEntity<Object> handleClienteVinculadoResultado(ClienteVinculadoResultadoException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String errorMessage = error.getDefaultMessage();
            errors.put("error", errorMessage);  // conforme seu padrão de "error"
        });

        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);  // status 404 como você pediu
    }
    @ExceptionHandler(EmpresaVinculoObrigatorioException.class)
    public ResponseEntity<Object> handleEmpresaVinculoObrigatorio(EmpresaVinculoObrigatorioException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Violação de chave única ou integridade referencial.");

        return new ResponseEntity<>(body, HttpStatus.CONFLICT); // 409 Conflict
    }
    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<Object> handleInternalServerError(InternalServerErrorException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Erro na comunicação com o SAAM. Verifique o serviço externo.");

        return new ResponseEntity<>(body, HttpStatus.BAD_GATEWAY); // 502 Bad Gateway
    }
}