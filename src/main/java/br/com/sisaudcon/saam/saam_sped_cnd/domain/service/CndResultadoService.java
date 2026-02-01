package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.InternalServerErrorException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoComClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ResultadoNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.CndResultadoMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@Service
public class CndResultadoService{
    private final ClienteRepository clienteRepo;
    private final CndResultadoRepository resultadoRepository;
    private final SituacaoValidationService situacaoValidationService;
    private final CndResultadoMapper cndResultadoMapper;

    @Transactional
    public CndResultado criarResultado(CndResultado dto) {
        Cliente cliente = clienteRepo.findById(dto.getCliente().getId())
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado"));

        dto.setCliente(cliente);
        dto.setDataProcessamento(OffsetDateTime.now());
        return resultadoRepository.save(dto);
    }

    @Transactional
    public void excluirResultado(Long resultadoId) {
        if (!resultadoRepository.existsById(resultadoId)) {
            throw new ClienteNotFoundException("Resultado não encontrado.");
        }
        resultadoRepository.deleteById(resultadoId);
    }

    @Transactional(readOnly = true)
    public List<CndResultadoDTO> findAllByClienteId(Integer clienteId) {
        List<CndResultado> resultados = resultadoRepository.findAllByCliente_Id(clienteId);
        return cndResultadoMapper.toDTOList(resultados);
    }

    @Transactional(readOnly = true)
    public List<CndResultadoComClienteDTO> listarTodosComCliente() {
        List<CndResultado> resultados = resultadoRepository.findAllWithClienteAndEmpresa();
        return resultados.stream()
                .map(this::mapToComClienteDTO)
                .collect(Collectors.toList());
    }

    private CndResultadoComClienteDTO mapToComClienteDTO(CndResultado resultado) {
        CndResultadoComClienteDTO dto = new CndResultadoComClienteDTO();
        dto.setId(resultado.getId());
        dto.setDataProcessamento(resultado.getDataProcessamento());
        dto.setSituacao(resultado.getSituacao());
        dto.setDataEmissao(resultado.getDataEmissao());
        dto.setDataValidade(resultado.getDataValidade());
        dto.setCodigoControle(resultado.getCodigoControle());
        dto.setStatus(resultado.getStatus());
        dto.setOrgaoEmissor(resultado.getOrgaoEmissor());
        dto.setTipoCertidao(resultado.getTipoCertidao());
        dto.setTemArquivo(resultado.getArquivo() != null && !resultado.getArquivo().isBlank());

        CndResultadoComClienteDTO.ClienteInfo clienteInfo = new CndResultadoComClienteDTO.ClienteInfo();
        clienteInfo.setId(resultado.getCliente().getId());
        clienteInfo.setCnpj(resultado.getCliente().getCnpj());
        clienteInfo.setNomeEmpresa(resultado.getCliente().getEmpresa().getNomeEmpresa());
        dto.setCliente(clienteInfo);

        return dto;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> downloadPdf(Long id) {
        CndResultado resultado = resultadoRepository.findById(id)
                .orElseThrow(() -> new ResultadoNotFoundException("Resultado não encontrado"));

        if (resultado.getArquivo() == null || resultado.getArquivo().isBlank()) {
            throw new ResultadoNotFoundException("Arquivo PDF não disponível para este resultado");
        }

        try {
            byte[] pdfBytes = Base64.getDecoder().decode(resultado.getArquivo());

            String cnpj = resultado.getCliente().getCnpj().replaceAll("[^0-9]", "");
            String orgao = getOrgaoAbbreviation(resultado.getTipoCertidao());
            String data = resultado.getDataEmissao() != null ?
                    resultado.getDataEmissao().format(DateTimeFormatter.ISO_LOCAL_DATE) :
                    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

            String filename = String.format("CND_%s_%s_%s.pdf", cnpj, orgao, data);

            log.info("Download de PDF realizado para CND #{} - Arquivo: {}", id, filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                            .filename(filename)
                            .build().toString())
                    .body(pdfBytes);
        } catch (Exception e) {
            log.error("Erro ao processar download do PDF para CND #{}", id, e);
            throw new InternalServerErrorException("Erro ao gerar arquivo para download");
        }
    }

    private String getOrgaoAbbreviation(String tipoCertidao) {
        if (tipoCertidao == null) return "OUTRO";
        String tipo = tipoCertidao.toLowerCase();
        if (tipo.contains("federal")) return "RFB";
        if (tipo.contains("estadual")) return "EST";
        if (tipo.contains("municipal")) return "MUN";
        return "OUTRO";
    }
}
