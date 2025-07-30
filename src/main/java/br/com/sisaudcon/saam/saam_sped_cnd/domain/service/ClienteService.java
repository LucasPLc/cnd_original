package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.ClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.ClienteMapper;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CndResultadoService cndResultadoService;

    public ClienteDTO getClienteByCnpj(String cnpj) {
        Cliente cliente = clienteRepository.findByCnpj(cnpj)
            .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado"));

        return ClienteMapper.toDTO(cliente);
    }

    public long countClientes() {
        return clienteRepository.count();
    }

    public Map<String, Object> getDebugInfoByCnpj(String cnpj) {
        Cliente cliente = clienteRepository.findByCnpjSemFormatacao(cnpj)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado para o CNPJ: " + cnpj));

        List<CndResultadoDTO> resultados = cndResultadoService.findAllByClienteId(cliente.getId());

        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("clienteEncontrado", ClienteMapper.toDTO(cliente));
        debugInfo.put("resultadosAssociados", resultados);

        return debugInfo;
    }
}
