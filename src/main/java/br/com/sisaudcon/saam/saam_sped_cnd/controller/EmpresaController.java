package br.com.sisaudcon.saam.saam_sped_cnd.controller;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.integracao.EmpresaSaamService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.integracao.EmpresaSaamService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/empresas")
@Validated
@Slf4j
public class EmpresaController {

    private final EmpresaSaamService empresasSaam;

    public EmpresaController(EmpresaSaamService empresasSaam) {
        this.empresasSaam = empresasSaam;
    }

    /**
     * Retorna a lista de empresas integradas para um cliente SAAM.
     * O ID do cliente é extraído do token JWT validado pelo Spring Security.
     *
     * @return Lista de empresas vinculadas.
     */
    @GetMapping
    public ResponseEntity<?> listarEmpresasPorCliente() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String idClienteSaam = authentication.getName();

        log.info("Buscando empresas para o cliente SAAM ID: {}", idClienteSaam);

        List<IntegracaoEmpresa> empresas = empresasSaam.obterListaDeEmpresasDoSaam(idClienteSaam);

        if (empresas == null || empresas.isEmpty()) {
            log.warn("Nenhuma empresa encontrada para o cliente SAAM ID: {}", idClienteSaam);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(empresas);
    }
}

