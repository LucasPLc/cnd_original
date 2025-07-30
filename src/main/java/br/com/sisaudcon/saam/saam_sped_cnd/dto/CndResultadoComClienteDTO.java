package br.com.sisaudcon.saam.saam_sped_cnd.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
public class CndResultadoComClienteDTO {

    private Long id;
    private OffsetDateTime dataProcessamento;
    private String situacao;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private String codigoControle;
    private String status;
    private String orgaoEmissor;
    private String tipoCertidao;
    private ClienteInfo cliente;

    @Data
    public static class ClienteInfo {
        private Integer id;
        private String cnpj;
        private String nomeEmpresa;
    }
}
