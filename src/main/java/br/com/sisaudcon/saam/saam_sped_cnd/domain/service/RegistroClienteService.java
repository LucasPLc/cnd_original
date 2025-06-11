package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteVinculadoResultadoException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.EmpresaVinculoObrigatorioException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@AllArgsConstructor
@Service
public class RegistroClienteService {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final CndResultadoRepository cndResultadoRepository;

@Transactional
public Cliente salvar(Cliente cliente) {
    if (cliente.getEmpresa() == null || cliente.getEmpresa().getIdEmpresa() == null) {
        throw new EmpresaVinculoObrigatorioException("É necessário informar uma empresa válida (fk_empresa).");
    }
    Optional<Empresa> empresaExistente = empresaRepository.findByIdEmpresa(cliente.getEmpresa().getIdEmpresa());

    Empresa empresaSalva;

    if (empresaExistente.isPresent()) {
        Empresa empresa = empresaExistente.get();
        empresa.setNomeEmpresa(cliente.getEmpresa().getNomeEmpresa());
        empresa.setCnpj(cliente.getEmpresa().getCnpj());
        empresaSalva = empresaRepository.save(empresa);
    } else {
        empresaSalva = empresaRepository.save(cliente.getEmpresa());
    }

    cliente.setEmpresa(empresaSalva);

    // Verifica se o cliente já existe com base no CNPJ
    Optional<Cliente> clienteExistente = clienteRepository.findByCnpj(cliente.getCnpj());

    if (clienteExistente.isPresent()) {
        Cliente clienteParaAtualizar = clienteExistente.get();
        clienteParaAtualizar.setPeriodicidade(cliente.getPeriodicidade());
        clienteParaAtualizar.setStatusCliente(cliente.getStatusCliente());
        clienteParaAtualizar.setNacional(cliente.getNacional());
        clienteParaAtualizar.setMunicipal(cliente.getMunicipal());
        clienteParaAtualizar.setEstadual(cliente.getEstadual());
        clienteParaAtualizar.setEmpresa(cliente.getEmpresa());

        return clienteRepository.save(clienteParaAtualizar);
    }

    return clienteRepository.save(cliente);
}
    @Transactional
    public void excluir(Integer clienteId) {

        boolean existeVinculo = cndResultadoRepository.existsByCliente_Id(clienteId);

        if (existeVinculo) {
            throw new ClienteVinculadoResultadoException("Não é possível excluir o cliente. Existem resultados vinculados.");
        }

        clienteRepository.deleteById(clienteId);
    }
}