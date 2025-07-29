package br.com.sisaudcon.saam.saam_sped_cnd.controller;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.integracao.EmpresaSaamService;
import br.com.sisaudcon.saam.saam_sped_cnd.security.JwtTokenDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/empresas")
@Validated
@Slf4j
public class EmpresaController {

    private final EmpresaSaamService empresasSaam;
    private final JwtTokenDecoder jwtTokenDecoder;

    public EmpresaController(EmpresaSaamService empresasSaam, JwtTokenDecoder jwtTokenDecoder) {
        this.empresasSaam = empresasSaam;
        this.jwtTokenDecoder = jwtTokenDecoder;
    }

    /**
     * Retorna a lista de empresas integradas para um cliente SAAM.
     *
     * @param tokenHeader Header JWT enviado no header Authorization.
     * @return Lista de empresas vinculadas.
     */
    @GetMapping
    public ResponseEntity<?> listarEmpresasPorCliente(
            @RequestHeader("Authorization") @NotBlank String tokenHeader) {
        try {
            String token = tokenHeader.replace("Bearer ", "");
            String idClienteSaam = jwtTokenDecoder.extrairClientId(token);

            log.info("Token válido. Buscando empresas para o cliente SAAM ID: {}", idClienteSaam);

            List<IntegracaoEmpresa> empresas = empresasSaam.obterListaDeEmpresasDoSaam(idClienteSaam);

            if (empresas == null || empresas.isEmpty()) {
                log.warn("Nenhuma empresa encontrada para o cliente SAAM ID: {}", idClienteSaam);
                return ResponseEntity.noContent().build();
            }

            empresas.forEach(empresa -> empresa.setIdCliente(idClienteSaam));

            return ResponseEntity.ok(empresas);

        } catch (Exception e) {
            log.error("Erro ao processar token ou buscar empresas: {}", e.getMessage(), e);
            return ResponseEntity.status(401).body("Token inválido ou expirado.");
        }
    }
}

