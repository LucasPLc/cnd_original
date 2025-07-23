package br.com.sisaudcon.saam.saam_sped_cnd.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CredenciaisDbEmpresa {
    private String id;

    @JsonProperty("porta")
    private String porta;

    @JsonProperty("ip_servidor_web")
    private String ipServidorWeb;

    @JsonProperty("ip_banco")
    private String ipBanco;

}
