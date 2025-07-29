package br.com.sisaudcon.saam.saam_sped_cnd.integracao;

import br.com.sisaudcon.saam.saam_sped_cnd.dto.CredenciaisDbEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class IntegracaoService {

    private static final Logger logger = LoggerFactory.getLogger(IntegracaoService.class);

    private final RestTemplate apiSisaudconRestTemplate;
    private final String urlIntegracaoApiSisaudcon;
    private final String headerKey;
    private final String headerValue;

    private final RestTemplate restTemplate;
    private final String urlIntegracaoWebserviceSaam;

    private final CriptografiaService criptografiaService;
    private final Gson gson;

    public IntegracaoService(
            @Qualifier("apiSisaudconRestTemplate") RestTemplate apiSisaudconRestTemplate,
            @Value("${app.integration.api.sisaudcon.url}") String urlIntegracaoApiSisaudcon,
            @Value("${app.integration.api.sisaudcon.request-header-key}") String headerKey,
            @Value("${app.integration.api.sisaudcon.request-header-value}") String headerValue,
            @Qualifier("apiWebServiceRestTemplate") RestTemplate restTemplate,
            @Value("${app.integration.api.webservicesaam.url}") String urlIntegracaoWebserviceSaam,
            CriptografiaService criptografiaService,
            @Qualifier("apiGson") Gson gson
    ) {
        this.apiSisaudconRestTemplate = apiSisaudconRestTemplate;
        this.urlIntegracaoApiSisaudcon = urlIntegracaoApiSisaudcon;
        this.headerKey = headerKey;
        this.headerValue = headerValue;
        this.restTemplate = restTemplate;
        this.urlIntegracaoWebserviceSaam = urlIntegracaoWebserviceSaam;
        this.criptografiaService = criptografiaService;
        this.gson = gson;
    }

    public CredenciaisDbEmpresa buscarCredenciaisEmpresaPorCliente(String clientId) {
        String url = urlIntegracaoApiSisaudcon + clientId;
        logger.info("PASSO 1: Buscando credenciais em: {}", url);

        try {
            // Criar cabeçalhos e adicionar a chave da API
            HttpHeaders headers = new HttpHeaders();
            headers.set(headerKey, headerValue);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            logger.info("Enviando requisição com o cabeçalho: '{}'", headerKey);

            ResponseEntity<List<CredenciaisDbEmpresa>> response = apiSisaudconRestTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity, // Usando a entidade com o cabeçalho
                    new org.springframework.core.ParameterizedTypeReference<List<CredenciaisDbEmpresa>>() {}
            );

            List<CredenciaisDbEmpresa> credenciais = response.getBody();

            if (credenciais == null || credenciais.isEmpty()) {
                logger.warn("Nenhuma credencial encontrada para o clientId: {}", clientId);
                throw new RuntimeException("Nenhuma credencial encontrada para o clientId: " + clientId);
            }

            logger.info("Credenciais encontradas com sucesso para o clientId: {}", clientId);
            return credenciais.getFirst();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            logger.error("Erro na API ao buscar credenciais. Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Erro na API ao buscar credenciais: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Erro inesperado ao buscar credenciais para o clientId: {}", clientId, e);
            throw new RuntimeException("Erro inesperado ao buscar credenciais: " + e.getMessage(), e);
        }
    }

    public List<IntegracaoEmpresa> buscarBancosDeDadosEmpresa(CredenciaisDbEmpresa credenciais) {
        String url = (credenciais.getIpServidorWeb().equals("187.108.198.236")
                ? urlIntegracaoWebserviceSaam.replace("1", "5")
                : urlIntegracaoWebserviceSaam)
                + "servicoXml1132/getListaEmpresa/"
                + formatarParametro(credenciais.getIpBanco()) + "/"
                + formatarParametro(credenciais.getPorta()) + "/"
                + formatarParametro(credenciais.getId()) + "/"
                + formatarParametro("SA006-AUTOMACAO");

        logger.info("PASSO 2: Buscando lista de empresas em: {}", url);

        try {
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    String.class
            );

            String body = responseEntity.getBody();
            logger.debug("Corpo da resposta (bruto): {}", body);

            if (body == null || body.isBlank()) {
                logger.warn("Corpo da resposta da lista de empresas está vazio.");
                return Collections.emptyList();
            }

            logger.info("Resposta recebida, iniciando descriptografia.");
            return descriptografarCorpo(body, IntegracaoEmpresa.class);

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            logger.error("Erro na API ao buscar lista de empresas. Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Erro na API ao buscar lista de empresas: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Erro inesperado ao buscar lista de empresas.", e);
            throw new RuntimeException("Erro inesperado ao buscar lista de empresas: " + e.getMessage(), e);
        }
    }

    private <T> List<T> descriptografarCorpo(String corpo, Class<T> clazz) {
        try {
            logger.info("PASSO 3: Descriptografando corpo da resposta.");
            byte[] arrayBytes = gson.fromJson("[" + corpo + "]", byte[].class);
            String jsonDescriptografado = criptografiaService.decrypt(arrayBytes);
            logger.debug("JSON Descriptografado: {}", jsonDescriptografado);

            Type tipoLista = TypeToken.getParameterized(ArrayList.class, clazz).getType();
            List<T> result = gson.fromJson(jsonDescriptografado, tipoLista);
            logger.info("Corpo descriptografado e parseado com sucesso. {} itens encontrados.", result.size());
            return result;
        } catch (Exception e) {
            logger.error("Falha ao descriptografar ou parsear o corpo da resposta.", e);
            throw new RuntimeException("Falha ao processar resposta do serviço legado.", e);
        }
    }

    private String formatarParametro(Object parametro) {
        byte[] criptografado = criptografiaService.encrypt(gson.toJson(parametro));
        return gson.toJson(criptografado).replace("[", "").replace("]", "");
    }
}
