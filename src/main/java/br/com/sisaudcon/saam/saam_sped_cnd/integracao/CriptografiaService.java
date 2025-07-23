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
