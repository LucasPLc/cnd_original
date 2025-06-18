package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.util.CndParserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class CndResultadoSchedulerService {

    private final CndResultadoRepository repository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Cron configurável em application.properties
    @Value("${cnd.resultado.scheduled.cron}")
    private String cron;

    public CndResultadoSchedulerService(CndResultadoRepository repository) {
        this.repository = repository;
    }

    @Scheduled(cron = "${cnd.resultado.scheduled.cron}")
    @Transactional
    public void processarNovosResultados() {
        log.info("Iniciando extração de dados de CND para resultados pendentes...");

        // 1) Buscar só os registros concluídos e sem situação
        List<CndResultado> pendentes = repository.findByStatusAndSituacaoIsNull("concluido");
        log.info("Encontrados {} registros pendentes", pendentes.size());

        for (CndResultado resultado : pendentes) {
            try {
                // 2) Extrair campos do PDF Base64
                Map<String, String> dados = CndParserUtil.extrairDadosCndBase64(resultado.getArquivo());

                // 3) Setar situação
                resultado.setSituacao(dados.get("situacao"));

                // 4) Data de emissão (somente data)
                String emissaoRaw = dados.get("dataEmissao");
                if (emissaoRaw != null) {
                    // extrair parte dd/MM/yyyy após "do dia "
                    String dataPart = emissaoRaw.substring(emissaoRaw.lastIndexOf(' ') + 1);
                    LocalDate dataEmissao = LocalDate.parse(dataPart, dateFormatter);
                    resultado.setDataEmissao(dataEmissao);
                }

                // 5) Data de validade
                String validadeRaw = dados.get("dataValidade");
                if (validadeRaw != null) {
                    LocalDate dataValidade = LocalDate.parse(validadeRaw, dateFormatter);
                    resultado.setDataValidade(dataValidade);
                }

                // 6) Código de controle
                resultado.setCodigoControle(dados.get("codigoControle"));

                // 7) Salvar alterações
                repository.save(resultado);
                log.info("Registro CND #{} atualizado com sucesso", resultado.getId());

            } catch (Exception ex) {
                log.error("Falha ao processar CND #{}: {}", resultado.getId(), ex.getMessage());
                // continuar para os próximos
            }
        }

        log.info("Finalizada extração de dados de CND.");
    }
}
