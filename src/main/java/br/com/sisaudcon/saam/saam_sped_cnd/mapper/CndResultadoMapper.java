package br.com.sisaudcon.saam.saam_sped_cnd.mapper;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;

public class CndResultadoMapper {

    public static CndResultadoDTO toDTO(CndResultado entity) {
        if (entity == null) {
            return null;
        }

        CndResultadoDTO dto = new CndResultadoDTO();
        dto.setId(entity.getId());
        dto.setDataProcessamento(entity.getDataProcessamento());
        dto.setArquivo(entity.getArquivo());
        dto.setSituacao(entity.getSituacao());
        dto.setDataEmissao(entity.getDataEmissao());
        dto.setDataValidade(entity.getDataValidade());
        dto.setCodigoControle(entity.getCodigoControle());
        dto.setStatus(entity.getStatus());
        if (entity.getCliente() != null) {
            dto.setClienteId(entity.getCliente().getId());
        }

        return dto;
    }

    public static CndResultado toEntity(CndResultadoDTO dto) {
        if (dto == null) {
            return null;
        }

        CndResultado entity = new CndResultado();
        entity.setId(dto.getId());
        entity.setDataProcessamento(dto.getDataProcessamento());
        entity.setArquivo(dto.getArquivo());
        entity.setSituacao(dto.getSituacao());
        entity.setDataEmissao(dto.getDataEmissao());
        entity.setDataValidade(dto.getDataValidade());
        entity.setCodigoControle(dto.getCodigoControle());
        entity.setStatus(dto.getStatus());

        return entity;
    }
}
