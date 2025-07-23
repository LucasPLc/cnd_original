package br.com.sisaudcon.saam.saam_sped_cnd.integracao;

import br.com.sisaudcon.saam.saam_sped_cnd.dto.CredenciaisDbEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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

    private final RestTemplate restTemplate;
    private final String urlIntegracaoWebserviceSaam;

    private final CriptografiaService criptografiaService;
    private final Gson gson;

    public IntegracaoService(
            @Qualifier("apiSisaudconRestTemplate") RestTemplate apiSisaudconRestTemplate,
            @Value("${app.integration.api.sisaudcon.url}") String urlIntegracaoApiSisaudcon,
            @Qualifier("apiWebServiceRestTemplate") RestTemplate restTemplate,
            @Value("${app.integration.api.webservicesaam.url}") String urlIntegracaoWebserviceSaam,
            CriptografiaService criptografiaService,
            @Qualifier("apiGson") Gson gson
    ) {
        this.apiSisaudconRestTemplate = apiSisaudconRestTemplate;
        this.urlIntegracaoApiSisaudcon = urlIntegracaoApiSisaudcon;
        this.restTemplate = restTemplate;
        this.urlIntegracaoWebserviceSaam = urlIntegracaoWebserviceSaam;
        this.criptografiaService = criptografiaService;
        this.gson = gson;
    }

    public CredenciaisDbEmpresa buscarCredenciaisEmpresaPorCliente(String clientId) {
        ResponseEntity<List<CredenciaisDbEmpresa>> response = apiSisaudconRestTemplate.exchange(
                urlIntegracaoApiSisaudcon + clientId,
                HttpMethod.GET,
                null,
                new org.springframework.core.ParameterizedTypeReference<List<CredenciaisDbEmpresa>>() {
                }
        );

        List<CredenciaisDbEmpresa> credenciais = response.getBody();

        if (credenciais == null || credenciais.isEmpty()) {
            throw new RuntimeException("Nenhuma credencial encontrada para o clientId: " + clientId);
        }

        return credenciais.getFirst();
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

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                String.class
        );

        String body = responseEntity.getBody();

        if (body == null || body.isBlank()) {
            return Collections.emptyList();
        }

        return descriptografarCorpo(body, IntegracaoEmpresa.class);
    }

    private <T> List<T> descriptografarCorpo(String corpo, Class<T> clazz) {
        byte[] arrayBytes = gson.fromJson("[" + corpo + "]", byte[].class);
        String jsonDescriptografado = criptografiaService.decrypt(arrayBytes);

        Type tipoLista = TypeToken.getParameterized(ArrayList.class, clazz).getType();

        return gson.fromJson(jsonDescriptografado, tipoLista);
    }

    private String formatarParametro(Object parametro) {
        byte[] criptografado = criptografiaService.encrypt(gson.toJson(parametro));
        return gson.toJson(criptografado).replace("[", "").replace("]", "");
    }
}
