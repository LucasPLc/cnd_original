package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteVinculadoResultadoException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.EmpresaVinculoObrigatorioException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@AllArgsConstructor
@Service
public class RegistroClienteService {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final CndResultadoRepository cndResultadoRepository;
    private final SituacaoValidationService situacaoValidationService;

    @Transactional
    public Cliente salvar(Cliente cliente) {
        // 1) obtém e valida situação
        int situacao = situacaoValidationService.validar(cliente.getEmpresa().getIdEmpresa());

        // 2) salva ou atualiza a empresa, já populando o statusEmpresa
        Empresa empresaSalva = empresaRepository
                .findByIdEmpresa(cliente.getEmpresa().getIdEmpresa())
                .map(e -> {
                    e.setNomeEmpresa(  cliente.getEmpresa().getNomeEmpresa());
                    e.setCnpj(         cliente.getEmpresa().getCnpj());
                    e.setStatusEmpresa(String.valueOf(situacao));
                    return empresaRepository.save(e);
                })
                .orElseGet(() -> {
                    Empresa nova = new Empresa();
                    nova.setIdEmpresa(   cliente.getEmpresa().getIdEmpresa());
                    nova.setNomeEmpresa( cliente.getEmpresa().getNomeEmpresa());
                    nova.setCnpj(        cliente.getEmpresa().getCnpj());
                    nova.setStatusEmpresa(String.valueOf(situacao));
                    return empresaRepository.save(nova);
                });

        cliente.setEmpresa(empresaSalva);

        // 3) verifica duplicado e salva cliente
        Optional<Cliente> dup = (cliente.getId() == null)
                ? clienteRepository.findByCnpjAndEmpresa_IdEmpresa(
                cliente.getCnpj(), empresaSalva.getIdEmpresa())
                : clienteRepository.findByCnpjAndEmpresa_IdEmpresaAndIdNot(
                cliente.getCnpj(), empresaSalva.getIdEmpresa(), cliente.getId());

        if (dup.isPresent()) {
            throw new DataIntegrityViolationException(
                    "Já existe esse CNPJ para essa empresa.");
        }

        return clienteRepository.save(cliente);
    }
    // busca cliente para pegar idEmpresa
    public void excluir(Integer clienteId) {

        Cliente c = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado"));
        situacaoValidationService.validar(c.getEmpresa().getIdEmpresa());

        boolean existeVinculo = cndResultadoRepository.existsByCliente_Id(clienteId);

        if (existeVinculo) {
            throw new ClienteVinculadoResultadoException("Não é possível excluir o cliente. Existem resultados vinculados.");
        }

        clienteRepository.deleteById(clienteId);
    }
}