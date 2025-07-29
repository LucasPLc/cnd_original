package br.com.sisaudcon.saam.saam_sped_cnd.integracao.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Configuration
public class RestTemplateConfig {

    @Bean
    @Qualifier("apiSisaudconRestTemplate")
    public RestTemplate apiSisaudconRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        
        // Adiciona um conversor que aceita text/html mas o trata como JSON
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>(restTemplate.getMessageConverters());
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL)); // Aceita qualquer content-type
        messageConverters.add(0, converter); // Adiciona no início para ter prioridade
        
        restTemplate.setMessageConverters(messageConverters);
        
        return restTemplate;
    }

    @Bean
    @Qualifier("apiWebServiceRestTemplate")
    public RestTemplate apiWebServiceRestTemplate() {
        return new RestTemplate();
    }
}

