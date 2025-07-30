package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ResultadoNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.CndResultadoMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@AllArgsConstructor
@Service
public class CndResultadoService{
    private final ClienteRepository clienteRepo;
    private final CndResultadoRepository resultadoRepository;
    private final SituacaoValidationService situacaoValidationService;
    private final CndResultadoMapper cndResultadoMapper;

    @Transactional
    public CndResultado criarResultado(CndResultado dto) {
        // busca cliente
        Cliente cliente = clienteRepo.findById(dto.getCliente().getId())
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado"));

        //  valida situação
        situacaoValidationService.validarAutorizacaoEmpresa(cliente.getEmpresa().getIdEmpresa());

        //  popular data de processamento se vier nulo
        if (dto.getDataProcessamento() == null) {
            dto.setDataProcessamento(OffsetDateTime.now());
        }

        dto.setCliente(cliente);
        return resultadoRepository.save(dto);
    }

    @Transactional
    public void excluirResultado(Long resultadoId) {
        boolean exists = resultadoRepository.existsById(resultadoId);
        if (!exists) {
            throw new ResultadoNotFoundException("Resultado não encontrado para o ID informado.");
        }
        resultadoRepository.deleteById(resultadoId);
    }

    @Transactional(readOnly = true)
    public List<CndResultadoDTO> findAllByClienteId(Integer clienteId) {
        List<CndResultado> resultados = resultadoRepository.findAllByCliente_Id(clienteId);
        return cndResultadoMapper.toDTOList(resultados);
    }
}