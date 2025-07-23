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
