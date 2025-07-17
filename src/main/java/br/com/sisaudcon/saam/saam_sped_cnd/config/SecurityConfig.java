package br.com.sisaudcon.saam.saam_sped_cnd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desabilitar CSRF, pois a aplicação é stateless (sem sessão no backend)
            .csrf(csrf -> csrf.disable())

            // Configurar a política de sessão para ser stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Configurar as regras de autorização para as requisições HTTP
            .authorizeHttpRequests(authorize -> authorize
                // Permitir requisições OPTIONS para todas as rotas (essencial para CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Permitir todas as outras requisições (ajuste conforme a necessidade de segurança)
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
