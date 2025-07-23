package br.com.sisaudcon.saam.saam_sped_cnd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        logger.info(">>> JwtRequestFilter: Recebido header 'Authorization': {}", authorizationHeader);


        String jwt = null;
        String clientId = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            logger.info(">>> Token extraído: {}", jwt);
            if (jwtUtil.validateToken(jwt)) {
                clientId = jwtUtil.extractClientId(jwt);
                logger.info(">>> Token validado com sucesso para clientId: {}", clientId);
            } else {
                logger.warn(">>> Falha na validação do token.");
            }
        } else {
            logger.warn(">>> Header 'Authorization' não encontrado ou não começa com 'Bearer '.");
        }

        if (clientId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Criamos um UserDetails simples, pois a autorização é baseada no token, não em roles de usuário.
            UserDetails userDetails = new User(clientId, "", new ArrayList<>());

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // Adiciona o clientId ao request para uso nos controllers
            request.setAttribute("clientId", clientId);
        }

        chain.doFilter(request, response);
    }
}
