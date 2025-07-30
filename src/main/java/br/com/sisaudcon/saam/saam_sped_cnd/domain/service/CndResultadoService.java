package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoComClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.CndResultadoMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class CndResultadoService{
    private final ClienteRepository clienteRepo;
    private final CndResultadoRepository resultadoRepository;
    private final SituacaoValidationService situacaoValidationService;
    private final CndResultadoMapper cndResultadoMapper;

    @Transactional
    public CndResultado criarResultado(CndResultado dto) {
        Cliente cliente = clienteRepo.findById(dto.getCliente().getId())
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado"));

        dto.setCliente(cliente);
        dto.setDataProcessamento(OffsetDateTime.now());
        return resultadoRepository.save(dto);
    }

    @Transactional
    public void excluirResultado(Long resultadoId) {
        if (!resultadoRepository.existsById(resultadoId)) {
            throw new ClienteNotFoundException("Resultado não encontrado.");
        }
        resultadoRepository.deleteById(resultadoId);
    }

    @Transactional(readOnly = true)
    public List<CndResultadoDTO> findAllByClienteId(Integer clienteId) {
        List<CndResultado> resultados = resultadoRepository.findAllByCliente_Id(clienteId);
        return cndResultadoMapper.toDTOList(resultados);
    }

    @Transactional(readOnly = true)
    public List<CndResultadoComClienteDTO> listarTodosComCliente() {
        List<CndResultado> resultados = resultadoRepository.findAllWithClienteAndEmpresa();
        return resultados.stream()
                .map(this::mapToComClienteDTO)
                .collect(Collectors.toList());
    }

    private CndResultadoComClienteDTO mapToComClienteDTO(CndResultado resultado) {
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

        CndResultadoComClienteDTO.ClienteInfo clienteInfo = new CndResultadoComClienteDTO.ClienteInfo();
        clienteInfo.setId(resultado.getCliente().getId());
        clienteInfo.setCnpj(resultado.getCliente().getCnpj());
        clienteInfo.setNomeEmpresa(resultado.getCliente().getEmpresa().getNomeEmpresa());
        dto.setCliente(clienteInfo);

        return dto;
    }
}
