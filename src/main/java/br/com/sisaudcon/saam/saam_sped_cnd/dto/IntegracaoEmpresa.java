package br.com.sisaudcon.saam.saam_sped_cnd.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IntegracaoEmpresa {

    @SerializedName("CGC")
    private String cgc;

    @SerializedName("IE")
    private String ie;

    @SerializedName("NOME")
    private String nome;

    @SerializedName("NOME_FANTASIA")
    private String nomeFantasia;

    @SerializedName("BANCO")
    private String banco;

    @SerializedName("CONTROLE_IE")
    private String controlePorIE;

    @SerializedName("ID")
    private String id;
}
