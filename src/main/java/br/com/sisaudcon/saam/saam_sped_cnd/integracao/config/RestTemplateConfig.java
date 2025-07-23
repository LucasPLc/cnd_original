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

