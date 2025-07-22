package br.com.sisaudcon.saam.saam_sped_cnd.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .setAllowedClockSkewSeconds(60) // Adiciona a tolerância de 60 segundos
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractClientId(String token) {
        return extractClaim(token, claims -> claims.get("clientId", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean validateToken(String token) {
        try {
            final Claims claims = extractAllClaims(token);

            if (!"saam".equals(claims.getIssuer())) {
                return false;
            }
            if (claims.get("clientId") == null) {
                return false;
            }
            // A verificação de expiração já é feita automaticamente pelo método parseClaimsJws,
            // que lançará uma ExpiredJwtException se o token estiver expirado (considerando o leeway).
            return true;
        } catch (Exception e) {
            // Captura qualquer exceção do JWT (assinatura inválida, expirado, etc.)
            return false;
        }
    }
}
