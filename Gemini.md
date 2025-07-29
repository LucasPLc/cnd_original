feat: add endepoint para buscar empresas SAAM
 parent 1429b541
 Branches 
featura/busca-empresas-saam
 No related tags found
 No related merge requests found
Changes
14
Showing 
 with 387 additions and 4 deletions
  pom.xml 
+
12
−
0
@@ -79,6 +79,18 @@
			<version>2.0.29</version>
		</dependency>

		<dependency>
			<groupId>com.google.code.gson</groupId>
			<artifactId>gson</artifactId>
			<version>2.11.0</version>
		</dependency>

		<!-- https://mvnrepository.com/artifact/com.auth0/java-jwt -->
		<dependency>
			<groupId>com.auth0</groupId>
			<artifactId>java-jwt</artifactId>
			<version>4.5.0</version>
		</dependency>
	</dependencies>

	<build>
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/controller/ClienteController.java 
+
1
−
0
@@ -28,6 +28,7 @@ public class ClienteController {
                .map(ClienteMapper::toDTO)
                .toList();
    }

    @GetMapping("/{clienteId}")
    public ResponseEntity<ClienteDTO> buscar(@PathVariable Integer clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/controller/EmpresaController.java  0 → 100644
+
60
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.controller;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.integracao.EmpresaSaamService;
import br.com.sisaudcon.saam.saam_sped_cnd.security.JwtTokenDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/empresas")
@Validated
@Slf4j
public class EmpresaController {

    private final EmpresaSaamService empresasSaam;
    private final JwtTokenDecoder jwtTokenDecoder;

    public EmpresaController(EmpresaSaamService empresasSaam, JwtTokenDecoder jwtTokenDecoder) {
        this.empresasSaam = empresasSaam;
        this.jwtTokenDecoder = jwtTokenDecoder;
    }

    /**
     * Retorna a lista de empresas integradas para um cliente SAAM.
     *
     * @param tokenHeader Header JWT enviado no header Authorization.
     * @return Lista de empresas vinculadas.
     */
    @GetMapping
    public ResponseEntity<?> listarEmpresasPorCliente(
            @RequestHeader("Authorization") @NotBlank String tokenHeader) {
        try {
            String token = tokenHeader.replace("Bearer ", "");
            String idClienteSaam = jwtTokenDecoder.extrairClientId(token);

            log.info("Token válido. Buscando empresas para o cliente SAAM ID: {}", idClienteSaam);

            List<IntegracaoEmpresa> empresas = empresasSaam.obterListaDeEmpresasDoSaam(idClienteSaam);

            if (empresas == null || empresas.isEmpty()) {
                log.warn("Nenhuma empresa encontrada para o cliente SAAM ID: {}", idClienteSaam);
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(empresas);

        } catch (Exception e) {
            log.error("Erro ao processar token ou buscar empresas: {}", e.getMessage(), e);
            return ResponseEntity.status(401).body("Token inválido ou expirado.");
        }
    }
}
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/domain/service/CndResultadoService.java 
+
0
−
2
@@ -21,11 +21,9 @@ public class CndResultadoService{

    @Transactional
    public CndResultado criarResultado(CndResultado dto) {
        // busca cliente
        Cliente cliente = clienteRepo.findById(dto.getCliente().getId())
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado"));

        //  valida situação
        situacaoValidationService.validarAutorizacaoEmpresa(cliente.getEmpresa().getIdEmpresa());

        //  popular data de processamento se vier nulo
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/dto/CredenciaisDbEmpresa.java  0 → 100644
+
21
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CredenciaisDbEmpresa {
    private String id;

    @JsonProperty("porta")
    private String porta;

    @JsonProperty("ip_servidor_web")
    private String ipServidorWeb;

    @JsonProperty("ip_banco")
    private String ipBanco;

}
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/dto/IntegracaoEmpresa.java  0 → 100644
+
15
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IntegracaoEmpresa {

    private String cnpj = null;
    private String ie = null;
    private String nome = null;
    private String banco = null;
    private String controlePorIE = null;
}
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/integracao/CriptografiaService.java  0 → 100644
+
40
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.integracao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Service
public class CriptografiaService {

    private static final Logger logger = LoggerFactory.getLogger(CriptografiaService.class);

    private static final byte[] keyContent = new byte[]{80, 75, 3, 4, 20, 0, 8, 8, 8, 0, 39, 64, -69, 80, 0, 0};
    private static final SecretKey key = new SecretKeySpec(keyContent, "AES");

    public byte[] encrypt(String message) {
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return cipher.doFinal(message.getBytes());
        } catch (Exception ex) {
            logger.error("Erro ao criptografar mensagem", ex);
            return null;
        }
    }

    public String decrypt(byte[] message) {
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(message));
        } catch (Exception ex) {
            logger.error("Erro ao descriptografar mensagem", ex);
            return null;
        }
    }
}
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/integracao/EmpresaSaamService.java  0 → 100644
+
35
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.integracao;

import br.com.sisaudcon.saam.saam_sped_cnd.dto.CredenciaisDbEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço dedicado a fornecer endpoints de diagnóstico para inspecionar
 * as respostas de serviços externos.
 */
@Service
public class EmpresaSaamService {

    private final IntegracaoService integrationService;

    @Autowired
    public EmpresaSaamService(IntegracaoService integrationService) {
        this.integrationService = integrationService;
    }

    /**
     * Realiza a busca de credenciais e, em seguida, a lista de empresas de integração
     * a partir dos serviços externos para um determinado ID de cliente.
     *
     * @param saamClientId O ID do cliente a ser diagnosticado.
     * @return A lista de empresas de integração retornada pelo webservice legado.
     */
    public List<IntegracaoEmpresa> obterListaDeEmpresasDoSaam(String saamClientId) {
        CredenciaisDbEmpresa credencial = integrationService.buscarCredenciaisEmpresaPorCliente(saamClientId);
        return integrationService.buscarBancosDeDadosEmpresa(credencial);
    }
}
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/integracao/IntegracaoService.java  0 → 100644
+
108
−
0
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
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/integracao/config/GsonConfig.java  0 → 100644
+
17
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.integracao.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GsonConfig {

    @Bean
    @Qualifier("apiGson")
    public Gson apiGson() {
        return new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
    }
}
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/integracao/config/RestTemplateConfig.java  0 → 100644
+
23
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.integracao.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    @Qualifier("apiSisaudconRestTemplate")
    public RestTemplate apiSisaudconRestTemplate() {
        return new RestTemplate();
    }

    @Bean
    @Qualifier("apiWebServiceRestTemplate")
    public RestTemplate apiWebServiceRestTemplate() {
        return new RestTemplate();
    }
}
  src/main/java/br/com/sisaudcon/saam/saam_sped_cnd/security/JwtTokenDecoder.java  0 → 100644
+
31
−
0
package br.com.sisaudcon.saam.saam_sped_cnd.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class JwtTokenDecoder {

    private final Algorithm algorithm;

    public JwtTokenDecoder(@Value("${chave.secreta.jwt}") String base64Key) {
        byte[] secretBytes = Base64.getDecoder().decode(base64Key);
        this.algorithm = Algorithm.HMAC256(secretBytes);
    }

    public String extrairClientId(String token) {
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("saam")
                .acceptLeeway(60)
                .build();

        DecodedJWT decodedJWT = verifier.verify(token);
        return decodedJWT.getClaim("clientId").asString();
    }
}
  src/main/resources/application-dev.properties 
+
20
−
1
@@ -5,4 +5,23 @@ spring.datasource.password=10100306@
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
cnd.resultado.scheduled.cron=0 */1 * * * *
\ No newline at end of file
cnd.resultado.scheduled.cron=0 */1 * * * *

saam.validation.url:http://saamauditoria-2.com.br:8085/api/empresa/getAttributeById/{idEmpresa}?attribute=situacao

chave.secreta.jwt=bWluaGEtY2hhdmUtc3VwZXItc2VjcmV0YS0xMjM0NTY=
api.saam.auth.url=http://201.182.97.84:8090


##############################################
# INTEGRAÇÃO SISAUDCON
##############################################
app.integration.api.sisaudcon.url=http://saamauditoria-2.com.br/api/empresa/credenciais/
app.integration.api.sisaudcon.request-header-key=key
app.integration.api.sisaudcon.request-header-value=65c25dee1d4694369fc5f76a9c5b5880

##############################################
# INTEGRAÇÃO WEBSERVICE SAAM
##############################################
#app.integration.api.webservicesaam.url=https://www.saamauditoria-1.com.br:8444/WebServiceSAAM-API/webresources/
app.integration.api.webservicesaam.url=http://localhost:8080/WebServiceSAAM-API/webresources/
\ No newline at end of file
  src/main/resources/application.properties 
+
4
−
1
#spring.profiles.active=dev
spring.profiles.active=dev

# PostgreSQL (valores vindos do docker-compose.yml)
spring.datasource.url=${SPRING_DATASOURCE_URL}
@@ -12,3 +12,6 @@ spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
saam.validation.url:http://saamauditoria-2.com.br:8085/api/empresa/getAttributeById/{idEmpresa}?attribute=situacao
chave.secreta.jwt=bWluaGEtY2hhdmUtc3VwZXItc2VjcmV0YS0xMjM0NTY=
api.saam.auth.url=http://201.182.97.84:8090


2025-07-29 08:21:07 cnd-frontend    | 172.21.0.1 - - [29/Jul/2025:11:21:07 +0000] "GET /favicon.ico HTTP/1.1" 200 649 "http://localhost:3000/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" "-"
2025-07-29 08:21:07 cnd-frontend    | 172.21.0.1 - - [29/Jul/2025:11:21:07 +0000] "GET /api/clientes HTTP/1.1" 200 233 "http://localhost:3000/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" "-"
2025-07-29 08:21:08 cnd-app         | 2025-07-29T11:21:08.693Z  INFO 1 --- [nio-8080-exec-9] b.c.s.s.s.controller.EmpresaController   : Buscando empresas para o cliente SAAM ID: 000001
2025-07-29 08:21:08 cnd-frontend    | 172.21.0.1 - - [29/Jul/2025:11:21:08 +0000] "GET /api/empresas HTTP/1.1" 500 76 "http://localhost:3000/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" "-"
2025-07-29 08:21:13 cnd-app         | 2025-07-29T11:21:13.901Z  INFO 1 --- [io-8080-exec-10] b.c.s.s.s.controller.EmpresaController   : Buscando empresas para o cliente SAAM ID: 000001
2025-07-29 08:21:13 cnd-frontend    | 172.21.0.1 - - [29/Jul/2025:11:21:13 +0000] "GET /api/empresas HTTP/1.1" 500 76 "http://localhost:3000/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" "-"