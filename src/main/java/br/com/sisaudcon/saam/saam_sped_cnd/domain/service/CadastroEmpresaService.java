package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.EmpresaNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.InternalServerErrorException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@AllArgsConstructor
@Service
public class CadastroEmpresaService {

    private final EmpresaRepository empresaRepository;

    @Transactional
    public Empresa buscarOuCadastrarEmpresa(Empresa empresaDTO) {
        Optional<Empresa> empresaExistenteOpt = empresaRepository.findByIdEmpresa(empresaDTO.getIdEmpresa());

        if (empresaExistenteOpt.isPresent()) {
            Empresa empresaExistente = empresaExistenteOpt.get();

            empresaExistente.setCnpj(empresaDTO.getCnpj());
            empresaExistente.setNomeEmpresa(empresaDTO.getNomeEmpresa());
            empresaExistente.setStatusEmpresa(empresaDTO.getStatusEmpresa()); // Opcional

            return empresaRepository.save(empresaExistente);
        } else {
            Empresa novaEmpresa = new Empresa();
            novaEmpresa.setIdEmpresa(empresaDTO.getIdEmpresa());
            novaEmpresa.setCnpj(empresaDTO.getCnpj());
            novaEmpresa.setNomeEmpresa(empresaDTO.getNomeEmpresa());
            novaEmpresa.setStatusEmpresa(empresaDTO.getStatusEmpresa()); // Opcional

            return empresaRepository.save(novaEmpresa);
        }
    }

//    private Empresa consultarEmpresaNoSAAM(String idEmpresa) {
//        try {
//
//            System.out.println(">>> Buscando no SAAM...");
//
//            // Simulando falha (exemplo de erro de integração)
//            if ("999999".equals(idEmpresa)) {
//                throw new RuntimeException("Falha simulada na chamada ao SAAM");
//            }
//
//            // Se não falhar, retorna uma empresa mock
//            Empresa empresa = new Empresa();
//            empresa.setCnpj("00.000.000/0001-" + idEmpresa);
//            empresa.setNomeEmpresa("Empresa " + idEmpresa);
//            empresa.setIdEmpresa(idEmpresa);
//            empresa.setStatusEmpresa("ATIVA");
//
//            return empresa;
//
//        } catch (Exception ex) {
//            throw new InternalServerErrorException("Erro na comunicação com o SAAM. Verifique o serviço externo.", ex);
//        }
//    }
}