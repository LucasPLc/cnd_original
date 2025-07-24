package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteVinculadoResultadoException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.EmpresaNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.integracao.EmpresaSaamService;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class RegistroClienteService {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final CndResultadoRepository cndResultadoRepository;
    private final SituacaoValidationService situacaoValidationService;
    private final EmpresaSaamService empresaSaamService;

    @Transactional
    public Cliente salvarClienteComEmpresa(Cliente cliente) {
        String idEmpresa = cliente.getEmpresa().getIdEmpresa();
        int situacao = situacaoValidationService.validarAutorizacaoEmpresa(idEmpresa);
        String statusEmpresa = String.valueOf(situacao);

        List<IntegracaoEmpresa> empresas = empresaSaamService.obterListaDeEmpresasDoSaam(idEmpresa);
        IntegracaoEmpresa empresaIntegracao = empresas.stream()
            .filter(e -> e.getId().equals(idEmpresa))
            .findFirst()
            .orElseThrow(() -> new EmpresaNotFoundException("Empresa não encontrada no SAAM para o ID informado."));

        Empresa empresa = new Empresa();
        empresa.setIdEmpresa(empresaIntegracao.getId());
        empresa.setNomeEmpresa(empresaIntegracao.getNomeFantasia());
        empresa.setCnpj(empresaIntegracao.getCgc());

        Empresa empresaSalva = salvarOuAtualizarEmpresa(empresa, statusEmpresa);
        cliente.setEmpresa(empresaSalva);

        verificarDuplicidadeCliente(cliente, empresaSalva.getIdEmpresa());

        return clienteRepository.save(cliente);
    }

    private Empresa salvarOuAtualizarEmpresa(Empresa empresa, String statusEmpresa) {
        return empresaRepository.findByIdEmpresa(empresa.getIdEmpresa())
            .map(e -> atualizarEmpresa(e, empresa, statusEmpresa))
            .orElseGet(() -> criarNovaEmpresa(empresa, statusEmpresa));
    }

    private Empresa atualizarEmpresa(Empresa existente, Empresa nova, String statusEmpresa) {
        existente.setNomeEmpresa(nova.getNomeEmpresa());
        existente.setCnpj(nova.getCnpj());
        existente.setStatusEmpresa(statusEmpresa);
        return empresaRepository.save(existente);
    }

    private Empresa criarNovaEmpresa(Empresa dados, String statusEmpresa) {
        Empresa nova = new Empresa();
        nova.setIdEmpresa(dados.getIdEmpresa());
        nova.setNomeEmpresa(dados.getNomeEmpresa());
        nova.setCnpj(dados.getCnpj());
        nova.setStatusEmpresa(statusEmpresa);
        return empresaRepository.save(nova);
    }

    private void verificarDuplicidadeCliente(Cliente cliente, String idEmpresa) {
        Optional<Cliente> duplicado = (cliente.getId() == null)
            ? clienteRepository.findByCnpjAndEmpresa_IdEmpresa(cliente.getCnpj(), idEmpresa)
            : clienteRepository.findByCnpjAndEmpresa_IdEmpresaAndIdNot(cliente.getCnpj(), idEmpresa, cliente.getId());

        duplicado.ifPresent(c -> {
            throw new DataIntegrityViolationException("Já existe esse CNPJ para essa empresa.");
        });
    }

    // busca cliente para pegar idEmpresa
    public void excluir(Integer clienteId) {

        Cliente c = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado"));
        situacaoValidationService.validarAutorizacaoEmpresa(c.getEmpresa().getIdEmpresa());

        boolean existeVinculo = cndResultadoRepository.existsByCliente_Id(clienteId);

        if (existeVinculo) {
            throw new ClienteVinculadoResultadoException("Não é possível excluir o cliente. Existem resultados vinculados.");
        }

        clienteRepository.deleteById(clienteId);
    }
}