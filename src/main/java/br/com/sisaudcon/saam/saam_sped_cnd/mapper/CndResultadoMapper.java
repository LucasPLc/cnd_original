package br.com.sisaudcon.saam.saam_sped_cnd.mapper;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CndResultadoMapper {

    public CndResultadoDTO toDTO(CndResultado cndResultado) {
        return toDTO(cndResultado, true);
    }

    public CndResultadoDTO toDTO(CndResultado cndResultado, boolean includeArquivo) {
        CndResultadoDTO dto = new CndResultadoDTO();
        dto.setId(cndResultado.getId());
        dto.setDataProcessamento(cndResultado.getDataProcessamento());
        if (includeArquivo) {
            dto.setArquivo(cndResultado.getArquivo());
        }
        dto.setSituacao(cndResultado.getSituacao());
        dto.setDataEmissao(cndResultado.getDataEmissao());
        dto.setDataValidade(cndResultado.getDataValidade());
        dto.setCodigoControle(cndResultado.getCodigoControle());
        dto.setStatus(cndResultado.getStatus());
        dto.setOrgaoEmissor(cndResultado.getOrgaoEmissor());
        dto.setTipoCertidao(cndResultado.getTipoCertidao());
        dto.setHasArquivo(cndResultado.getArquivo() != null && !cndResultado.getArquivo().isBlank());

        if (cndResultado.getCliente() != null) {
            dto.setClienteCnpj(cndResultado.getCliente().getCnpj());
            if (cndResultado.getCliente().getId() != null) {
                dto.setClienteId(cndResultado.getCliente().getId().longValue());
            }
        }
        return dto;
    }

    public List<CndResultadoDTO> toDTOList(List<CndResultado> cndResultados) {
        return cndResultados.stream()
                .map(resultado -> toDTO(resultado, false))
                .collect(Collectors.toList());
    }
}
