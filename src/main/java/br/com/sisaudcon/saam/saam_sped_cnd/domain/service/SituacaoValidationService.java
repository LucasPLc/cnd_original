package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.*;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
public class SituacaoValidationService {

    @Autowired
    @Qualifier("apiSisaudconRestTemplate")
    private RestTemplate restTemplate;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Value("${saam.validation.url}")
    private String validationUrl;

    public int validarAutorizacaoEmpresa(String idEmpresa) {
        log.info("Iniciando validação de autorização para a empresa ID: {}", idEmpresa);

        if (idEmpresa == null || idEmpresa.isBlank()) {
            log.error("ID da empresa é nulo ou vazio.");
            throw new ClienteIdInvalidoException("IDCLIENTE inválido ou não informado.");
        }

        int situacao;
        try {
            log.info("Tentando validar via serviço externo na URL: {}", validationUrl);
            ResponseEntity<Map> resp = restTemplate.getForEntity(validationUrl, Map.class, idEmpresa);
            log.info("Serviço externo respondeu com status: {}", resp.getStatusCode());

            HttpStatus status = HttpStatus.valueOf(resp.getStatusCode().value());
            if (status == HttpStatus.BAD_REQUEST || status == HttpStatus.NOT_FOUND) {
                throw new ClienteIdInvalidoException("IDCLIENTE inválido ou não informado.");
            }

            if (!status.is2xxSuccessful() || resp.getBody() == null) {
                throw new RestClientException("Resposta inválida do serviço externo.");
            }

            Object sit = resp.getBody().get("situacao");
            if (sit == null) {
                throw new RestClientException("Campo 'situacao' ausente na resposta do serviço externo.");
            }
            situacao = Integer.parseInt(sit.toString());
            log.info("Situação obtida do serviço externo: {}", situacao);

        } catch (Exception ex) {
            log.warn("Falha ao validar com serviço externo: {}. Partindo para o fallback no banco de dados local.", ex.getMessage());

            Optional<Empresa> empLocalOpt = empresaRepository.findByIdEmpresa(idEmpresa);
            Empresa empLocal = empLocalOpt.orElseThrow(() -> {
                log.error("Fallback falhou: Empresa com ID {} não encontrada no banco de dados local.", idEmpresa);
                return new ClienteIdInvalidoException("IDCLIENTE inválido ou não informado.");
            });

            String statusLocal = empLocal.getStatusEmpresa();
            log.info("Status da empresa encontrado no banco de dados local: '{}'", statusLocal);

            if (statusLocal == null || statusLocal.isBlank()) {
                log.error("Fallback falhou: O status da empresa no banco de dados local está vazio ou nulo para a empresa ID {}.", idEmpresa);
                throw new ServicoValidacaoIndisponivelException(
                        "Serviço de validação indisponível e sem dados de fallback. Tente novamente mais tarde."
                );
            }
            situacao = Integer.parseInt(statusLocal);
        }

        final int situacaoFinal = situacao;
        log.info("Situação final determinada: {}", situacaoFinal);

        empresaRepository.findByIdEmpresa(idEmpresa)
                .ifPresent(emp -> {
                    emp.setStatusEmpresa(String.valueOf(situacaoFinal));
                    empresaRepository.save(emp);
                    log.info("Status da empresa ID {} atualizado no banco de dados para: {}", idEmpresa, situacaoFinal);
                });

        if (situacao != 1) {
            log.warn("Acesso negado para empresa ID {}. Situação final não é 1.", idEmpresa);
            throw new ClienteNaoAutorizadoException("Acesso negado. Cliente sem autorização ativa.");
        }

        log.info("Validação de autorização para a empresa ID {} concluída com sucesso.", idEmpresa);
        return situacao;
    }

    public void validarPorCliente(Integer clienteId, ClienteRepository clienteRepo) {
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new ClienteNotFoundException(
                        "Cliente não encontrado para o ID informado."
                ));
        validarAutorizacaoEmpresa(cliente.getEmpresa().getIdEmpresa());
    }
}