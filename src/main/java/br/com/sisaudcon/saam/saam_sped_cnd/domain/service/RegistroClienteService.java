package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;
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

@Transactional
public Cliente salvar(Cliente cliente) {
    if (cliente.getEmpresa() == null || cliente.getEmpresa().getIdEmpresa() == null) {
        throw new EmpresaVinculoObrigatorioException("É necessário informar uma empresa válida (fk_empresa).");
    }

    // Verifica se a empresa existe ou cadastra nova
    Optional<Empresa> empresaExistenteOpt = empresaRepository.findByIdEmpresa(cliente.getEmpresa().getIdEmpresa());
    Empresa empresaSalva;

    if (empresaExistenteOpt.isPresent()) {
        Empresa empresaExistente = empresaExistenteOpt.get();
        empresaExistente.setNomeEmpresa(cliente.getEmpresa().getNomeEmpresa());
        empresaExistente.setCnpj(cliente.getEmpresa().getCnpj());
        empresaSalva = empresaRepository.save(empresaExistente);

        // Verifica se já existe um cliente com o mesmo CNPJ para essa empresa
        Optional<Cliente> clienteDuplicado = clienteRepository.findByCnpjAndEmpresa_IdEmpresa(
                cliente.getCnpj(), cliente.getEmpresa().getIdEmpresa());

        if (clienteDuplicado.isPresent()) {
            throw new DataIntegrityViolationException("Já existe esse CNPJ para essa empresa.");
        }

    } else {
        // Cria nova empresa
        empresaSalva = empresaRepository.save(cliente.getEmpresa());
    }

    cliente.setEmpresa(empresaSalva);
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