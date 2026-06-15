package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.CndResultadoService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoComClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/resultados")
@AllArgsConstructor
public class CndResultadoController {

    private static final Logger logger = LoggerFactory.getLogger(CndResultadoController.class);

    private final CndResultadoService cndResultadoService;

    @GetMapping
    public ResponseEntity<List<CndResultadoComClienteDTO>> listarTodos() {
        List<CndResultadoComClienteDTO> resultados = cndResultadoService.listarTodosComCliente();
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CndResultadoDTO> getResultadoPorId(@PathVariable Long id) {
        logger.info("Solicitando download do arquivo CND para o resultado ID: {}", id);
        CndResultadoDTO resultado = cndResultadoService.buscarPorId(id);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<CndResultadoDTO>> getResultadosPorClienteId(@PathVariable Integer clienteId) {
        List<CndResultadoDTO> resultados = cndResultadoService.findAllByClienteId(clienteId);
        return ResponseEntity.ok(resultados);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CndResultado adicionar(@Valid @RequestBody CndResultado cndResultado) {
        return cndResultadoService.criarResultado(cndResultado);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        cndResultadoService.excluirResultado(id);
    }
}