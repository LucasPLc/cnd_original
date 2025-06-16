package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.CndResultadoService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.CndResultadoMapper;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resultados")
@AllArgsConstructor
public class CndResultadoController {

    private final CndResultadoService resultadoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CndResultadoDTO criar(@RequestBody @Valid CndResultadoDTO dto) {
        CndResultado entidade = CndResultadoMapper.toEntity(dto);
        CndResultado salvo = resultadoService.criarResultado(entidade);
        return CndResultadoMapper.toDTO(salvo);
    }

    @DeleteMapping("/{resultadoId}")
    public ResponseEntity<Void> remover(@PathVariable Long resultadoId) {
        resultadoService.excluirResultado(resultadoId);
        return ResponseEntity.noContent().build();
    }
}