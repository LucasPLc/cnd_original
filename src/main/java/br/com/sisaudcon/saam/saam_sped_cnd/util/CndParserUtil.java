package br.com.sisaudcon.saam.saam_sped_cnd.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.ByteArrayInputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class CndParserUtil {

    public static Map<String, String> extrairDadosCndBase64(String base64Arquivo) {
        Map<String, String> dados = new HashMap<>();

        try {
            // 1) Decode
            byte[] decodedBytes = Base64.getDecoder().decode(base64Arquivo);

            // 2) Extrai texto e normaliza espaços
            String texto;
            try (PDDocument document = PDDocument.load(new ByteArrayInputStream(decodedBytes))) {
                texto = new PDFTextStripper().getText(document);
            }
            // Normaliza NBSP e múltiplos espaços
            texto = texto.replace('\u00A0', ' ')
                    .replaceAll("\\s+", " ");

            // 3) Extrair SITUAÇÃO: entre "CERTIDÃO POSITIVA" e "Nome:"
            int iSit = texto.indexOf("CERTIDÃO POSITIVA");
            int iNome = texto.indexOf("DE DÉBITOS");
            if (iSit >= 0 && iNome > iSit) {
                dados.put("situacao",
                        texto.substring(iSit, iNome).trim()
                );
            }

            // 4) dataEmissao: entre "Emitida às " e " <"
            dados.put("dataEmissao",
                    extrairEntre(texto, "Emitida às ", " <")
            );

            // 5) dataValidade: entre "Válida até " e o ponto final "."
            dados.put("dataValidade",
                    extrairEntre(texto, "Válida até ", ".")
            );

            // 6) codigoControle: entre "Código de controle da certidão: " e o próximo espaço ou fim
            dados.put("codigoControle",
                    extrairEntre(texto, "Código de controle da certidão: ", " ")
            );

        } catch (Exception e) {
            throw new RuntimeException("Erro ao extrair dados do PDF da CND", e);
        }

        return dados;
    }

    private static String extrairEntre(String texto, String inicio, String fim) {
        int i0 = texto.indexOf(inicio);
        if (i0 < 0) return null;
        int start = i0 + inicio.length();
        int i1 = texto.indexOf(fim, start);
        // se não achar o 'fim', retorna até o final do texto
        if (i1 < 0) return texto.substring(start).trim();
        return texto.substring(start, i1).trim();
    }
}