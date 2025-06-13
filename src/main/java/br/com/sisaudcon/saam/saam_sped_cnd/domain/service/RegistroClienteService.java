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
    // 1) valida fk_empresa
    if (cliente.getEmpresa() == null
            || cliente.getEmpresa().getIdEmpresa() == null) {
        throw new EmpresaVinculoObrigatorioException(
                "É necessário informar uma empresa válida (fk_empresa).");
    }

    // 2) salva ou atualiza a empresa
    Empresa empresaSalva = empresaRepository
            .findByIdEmpresa(cliente.getEmpresa().getIdEmpresa())
            .map(e -> {
                e.setNomeEmpresa(cliente.getEmpresa().getNomeEmpresa());
                e.setCnpj(cliente.getEmpresa().getCnpj());
                return empresaRepository.save(e);
            })
            .orElseGet(() -> empresaRepository.save(cliente.getEmpresa()));

    cliente.setEmpresa(empresaSalva);

    // 3) verifica duplicado
    Optional<Cliente> dup = (cliente.getId() == null)
            ? clienteRepository.findByCnpjAndEmpresa_IdEmpresa(
            cliente.getCnpj(), empresaSalva.getIdEmpresa())
            : clienteRepository.findByCnpjAndEmpresa_IdEmpresaAndIdNot(
            cliente.getCnpj(), empresaSalva.getIdEmpresa(), cliente.getId());

    if (dup.isPresent()) {
        throw new DataIntegrityViolationException(
                "Já existe esse CNPJ para essa empresa.");
    }

    // 4) salva o cliente
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