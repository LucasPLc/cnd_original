package br.com.sisaudcon.saam.saam_sped_cnd.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.ByteArrayInputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CndParserUtil {

    public static String extrairTextoBase64(String base64Arquivo) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Arquivo);
            String texto;
            try (PDDocument document = PDDocument.load(new ByteArrayInputStream(decodedBytes))) {
                texto = new PDFTextStripper().getText(document);
            }
            return texto.replace('\u00A0', ' ')
                    .replaceAll("\\s+", " ");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao extrair texto do PDF da CND", e);
        }
    }

    public static Map<String, String> extrairDadosCndBase64(String base64Arquivo) {
        Map<String, String> dados = new HashMap<>();
        String texto = extrairTextoBase64(base64Arquivo);

        // Situação (Ex: CERTIDÃO NEGATIVA DE DÉBITOS RELATIVOS...)
        Pattern situacaoPattern = Pattern.compile("CERTIDÃO\\s+(.*?)\\s+DE DÉBITOS", Pattern.CASE_INSENSITIVE);
        Matcher situacaoMatcher = situacaoPattern.matcher(texto);
        if (situacaoMatcher.find()) {
            dados.put("situacao", situacaoMatcher.group(1).trim());
        }

        // Data de Emissão (Ex: Emitida às 10:00:00 do dia 01/01/2024)
        Pattern emissaoPattern = Pattern.compile("Emitida às\\s+([\\d:]+)\\s+do dia\\s+(\\d{2}/\\d{2}/\\d{4})", Pattern.CASE_INSENSITIVE);
        Matcher emissaoMatcher = emissaoPattern.matcher(texto);
        if (emissaoMatcher.find()) {
            dados.put("dataEmissao", emissaoMatcher.group(2).trim());
        } else {
            // Fallback para o formato anterior se necessário
            dados.put("dataEmissao", extrairEntre(texto, "Emitida às ", " <"));
        }

        // Data de Validade (Ex: Válida até 01/07/2024)
        Pattern validadePattern = Pattern.compile("Válida até\\s+(\\d{2}/\\d{2}/\\d{4})", Pattern.CASE_INSENSITIVE);
        Matcher validadeMatcher = validadePattern.matcher(texto);
        if (validadeMatcher.find()) {
            dados.put("dataValidade", validadeMatcher.group(1).trim());
        }

        // Código de Controle
        Pattern codigoPattern = Pattern.compile("Código de controle da certidão:\\s+([A-Z0-9.-]+)", Pattern.CASE_INSENSITIVE);
        Matcher codigoMatcher = codigoPattern.matcher(texto);
        if (codigoMatcher.find()) {
            dados.put("codigoControle", codigoMatcher.group(1).trim());
        }

        return dados;
    }

    private static String extrairEntre(String texto, String inicio, String fim) {
        int i0 = texto.indexOf(inicio);
        if (i0 < 0) return null;
        int start = i0 + inicio.length();
        int i1 = texto.indexOf(fim, start);
        if (i1 < 0) {
            return texto.substring(start).trim();
        }
        return texto.substring(start, i1).trim();
    }
}