package br.com.sisaudcon.saam.saam_sped_cnd.mapper;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CndResultadoMapper {

    public CndResultadoDTO toDTO(CndResultado cndResultado) {
        CndResultadoDTO dto = new CndResultadoDTO();
        dto.setId(cndResultado.getId());
        dto.setDataProcessamento(cndResultado.getDataProcessamento());
        dto.setArquivo(cndResultado.getArquivo());
        dto.setSituacao(cndResultado.getSituacao());
        dto.setDataEmissao(cndResultado.getDataEmissao());
        dto.setDataValidade(cndResultado.getDataValidade());
        dto.setCodigoControle(cndResultado.getCodigoControle());
        dto.setStatus(cndResultado.getStatus());
        if (cndResultado.getCliente() != null && cndResultado.getCliente().getId() != null) {
            dto.setClienteId(cndResultado.getCliente().getId().longValue());
        }
        return dto;
    }

    public List<CndResultadoDTO> toDTOList(List<CndResultado> cndResultados) {
        return cndResultados.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
