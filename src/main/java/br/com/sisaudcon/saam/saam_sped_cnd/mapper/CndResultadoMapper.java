package br.com.sisaudcon.saam.saam_sped_cnd.mapper;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;

public class CndResultadoMapper {

    public static CndResultado toEntity(CndResultadoDTO dto) {
        CndResultado resultado = new CndResultado();
        resultado.setDataProcessamento(dto.getDataProcessamento());
        resultado.setArquivo(dto.getArquivo());
        resultado.setSituacao(dto.getSituacao());

        // seta o objeto Cliente com o ID
        br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente c = new br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente();
        c.setId(dto.getFkCliente());
        resultado.setCliente(c);

        return resultado;
    }

    public static CndResultadoDTO toDTO(CndResultado entidade) {
        CndResultadoDTO dto = new CndResultadoDTO();
        dto.setId(entidade.getId());
        dto.setDataProcessamento(entidade.getDataProcessamento());
        dto.setArquivo(entidade.getArquivo());
        dto.setSituacao(entidade.getSituacao());
        dto.setFkCliente(entidade.getCliente().getId());
        return dto;
    }
}