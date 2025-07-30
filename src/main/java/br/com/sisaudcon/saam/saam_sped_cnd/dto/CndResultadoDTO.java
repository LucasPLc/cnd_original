package br.com.sisaudcon.saam.saam_sped_cnd.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
public class CndResultadoDTO {
    private Long id;
    private OffsetDateTime dataProcessamento;
    private String arquivo;
    private String situacao;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private String codigoControle;
    private String status;
    private Long clienteId;
}
