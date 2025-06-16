package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.AcessoNegadoException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ServicoValidacaoIndisponivelException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Component
public class SituacaoValidationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final EmpresaRepository empresaRepository;

    @Value("${saam.validation.url:http://saamauditoria-2.com.br:8085/api/empresa/getAttributeById/{idEmpresa}?attribute=situacao}")
    private String validationUrl;

    public SituacaoValidationService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    public int validar(String idEmpresa) {
        int situacao;

        // 1) tenta chamar o serviço externo
        try {
            ResponseEntity<Map> resp = restTemplate.getForEntity(
                    validationUrl, Map.class, idEmpresa
            );
            if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) {
                throw new RestClientException("Resposta inválida");
            }
            Object sit = resp.getBody().get("situacao");
            if (sit == null) {
                throw new RestClientException("Campo 'situacao' ausente");
            }
            situacao = Integer.parseInt(sit.toString());

        } catch (RestClientException ex) {
            // 2) em caso de falha, faz fallback para o status armazenado localmente
            Empresa empLocal = empresaRepository.findByIdEmpresa(idEmpresa)
                    .orElseThrow(() ->
                            new ServicoValidacaoIndisponivelException(
                                    "Serviço de validação indisponível. Tente novamente mais tarde."
                            )
                    );
            String statusLocal = empLocal.getStatusEmpresa();
            if (statusLocal == null) {
                throw new ServicoValidacaoIndisponivelException(
                        "Serviço de validação indisponível. Tente novamente mais tarde."
                );
            }
            situacao = Integer.parseInt(statusLocal);
        }

        // 3) grava sempre o status mais recente no banco
        Optional<Empresa> optEmp = empresaRepository.findByIdEmpresa(idEmpresa);
        if (optEmp.isPresent()) {
            Empresa emp = optEmp.get();
            emp.setStatusEmpresa(String.valueOf(situacao));
            empresaRepository.save(emp);
        }

        // 4) se não for “1”, nega o acesso
        if (situacao != 1) {
            throw new AcessoNegadoException("Acesso negado. Cliente sem autorização ativa.");
        }
        return situacao;
    }

    /** Sobrecarga para validar por clienteId diretamente */
    public void validarPorCliente(Integer clienteId, ClienteRepository clienteRepo) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ClienteNotFoundException(
                        "Cliente não encontrado para o ID informado."
                ));
        validar(cliente.getEmpresa().getIdEmpresa());
    }
}