package br.com.sisaudcon.saam.saam_sped_cnd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CndResultadoDTO {

    private Long id;

    private OffsetDateTime dataProcessamento;

    @NotBlank(message = "Campo 'arquivo' é obrigatório.")
    private String arquivo;

    @NotBlank(message = "Campo 'situacao' é obrigatório.")
    private String situacao;

    @NotNull(message = "Campo 'fk_cliente' é obrigatório.")
    private Integer fkCliente;
}