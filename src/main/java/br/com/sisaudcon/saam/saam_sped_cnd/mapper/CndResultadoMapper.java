package br.com.sisaudcon.saam.saam_sped_cnd.mapper;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoComClienteDTO;
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
        dto.setOrgaoEmissor(cndResultado.getOrgaoEmissor());
        dto.setTipoCertidao(cndResultado.getTipoCertidao());
        dto.setHasArquivo(cndResultado.getArquivo() != null && !cndResultado.getArquivo().isBlank());

        if (cndResultado.getCliente() != null) {
            dto.setClienteId(cndResultado.getCliente().getId().longValue());
            dto.setClienteCnpj(cndResultado.getCliente().getCnpj());
        }
        return dto;
    }

    public CndResultadoComClienteDTO toComClienteDTO(CndResultado cndResultado) {
        CndResultadoComClienteDTO dto = new CndResultadoComClienteDTO();
        dto.setId(cndResultado.getId());
        dto.setDataProcessamento(cndResultado.getDataProcessamento());
        dto.setSituacao(cndResultado.getSituacao());
        dto.setDataEmissao(cndResultado.getDataEmissao());
        dto.setDataValidade(cndResultado.getDataValidade());
        dto.setCodigoControle(cndResultado.getCodigoControle());
        dto.setStatus(cndResultado.getStatus());
        dto.setOrgaoEmissor(cndResultado.getOrgaoEmissor());
        dto.setTipoCertidao(cndResultado.getTipoCertidao());
        dto.setHasArquivo(cndResultado.getArquivo() != null && !cndResultado.getArquivo().isBlank());

        if (cndResultado.getCliente() != null) {
            CndResultadoComClienteDTO.ClienteInfo clienteInfo = new CndResultadoComClienteDTO.ClienteInfo();
            clienteInfo.setId(cndResultado.getCliente().getId());
            clienteInfo.setCnpj(cndResultado.getCliente().getCnpj());
            if (cndResultado.getCliente().getEmpresa() != null) {
                clienteInfo.setNomeEmpresa(cndResultado.getCliente().getEmpresa().getNomeEmpresa());
            }
            dto.setCliente(clienteInfo);
        }
        return dto;
    }

    public List<CndResultadoDTO> toDTOList(List<CndResultado> cndResultados) {
        return cndResultados.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
