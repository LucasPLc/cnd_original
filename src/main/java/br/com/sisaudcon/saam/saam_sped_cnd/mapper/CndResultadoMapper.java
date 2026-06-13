package br.com.sisaudcon.saam.saam_sped_cnd.mapper;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CndResultadoMapper {

    public CndResultadoDTO toDTO(CndResultado cndResultado) {
        CndResultadoDTO dto = mapBaseFields(cndResultado);
        dto.setArquivo(cndResultado.getArquivo());
        return dto;
    }

    public CndResultadoDTO toSummaryDTO(CndResultado cndResultado) {
        return mapBaseFields(cndResultado);
    }

    private CndResultadoDTO mapBaseFields(CndResultado cndResultado) {
        CndResultadoDTO dto = new CndResultadoDTO();
        dto.setId(cndResultado.getId());
        dto.setDataProcessamento(cndResultado.getDataProcessamento());
        dto.setSituacao(cndResultado.getSituacao());
        dto.setDataEmissao(cndResultado.getDataEmissao());
        dto.setDataValidade(cndResultado.getDataValidade());
        dto.setCodigoControle(cndResultado.getCodigoControle());
        dto.setStatus(cndResultado.getStatus());
        dto.setOrgaoEmissor(cndResultado.getOrgaoEmissor());
        dto.setTipoCertidao(cndResultado.getTipoCertidao());
        dto.setHasArquivo(cndResultado.getArquivo() != null && !cndResultado.getArquivo().isEmpty());

        if (cndResultado.getCliente() != null) {
            if (cndResultado.getCliente().getId() != null) {
                dto.setClienteId(cndResultado.getCliente().getId().longValue());
            }
            dto.setClienteCnpj(cndResultado.getCliente().getCnpj());
        }
        return dto;
    }

    public List<CndResultadoDTO> toDTOList(List<CndResultado> cndResultados) {
        return cndResultados.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CndResultadoDTO> toSummaryDTOList(List<CndResultado> cndResultados) {
        return cndResultados.stream().map(this::toSummaryDTO).collect(Collectors.toList());
    }
}
