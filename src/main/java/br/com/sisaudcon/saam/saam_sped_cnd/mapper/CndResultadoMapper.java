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
        if (cndResultado.getCliente() != null && cndResultado.getCliente().getId() != null) {
            dto.setClienteId(cndResultado.getCliente().getId().longValue());
        }
        return dto;
    }

    public List<CndResultadoDTO> toDTOList(List<CndResultado> cndResultados) {
        return cndResultados.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CndResultadoComClienteDTO toSummaryDTO(CndResultado resultado) {
        CndResultadoComClienteDTO dto = new CndResultadoComClienteDTO();
        dto.setId(resultado.getId());
        dto.setDataProcessamento(resultado.getDataProcessamento());
        dto.setSituacao(resultado.getSituacao());
        dto.setDataEmissao(resultado.getDataEmissao());
        dto.setDataValidade(resultado.getDataValidade());
        dto.setCodigoControle(resultado.getCodigoControle());
        dto.setStatus(resultado.getStatus());
        dto.setOrgaoEmissor(resultado.getOrgaoEmissor());
        dto.setTipoCertidao(resultado.getTipoCertidao());
        dto.setHasArquivo(resultado.getArquivo() != null && !resultado.getArquivo().isEmpty());

        if (resultado.getCliente() != null) {
            CndResultadoComClienteDTO.ClienteInfo clienteInfo = new CndResultadoComClienteDTO.ClienteInfo();
            clienteInfo.setId(resultado.getCliente().getId());
            clienteInfo.setCnpj(resultado.getCliente().getCnpj());
            if (resultado.getCliente().getEmpresa() != null) {
                clienteInfo.setNomeEmpresa(resultado.getCliente().getEmpresa().getNomeEmpresa());
            }
            dto.setCliente(clienteInfo);
        }

        return dto;
    }

    public List<CndResultadoComClienteDTO> toSummaryDTOList(List<CndResultado> cndResultados) {
        return cndResultados.stream().map(this::toSummaryDTO).collect(Collectors.toList());
    }
}
