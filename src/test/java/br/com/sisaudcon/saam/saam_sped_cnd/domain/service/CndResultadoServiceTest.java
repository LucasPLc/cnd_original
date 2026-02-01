package br.com.sisaudcon.saam.saam_sped_cnd.domain.service;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.CndResultadoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Base64;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CndResultadoServiceTest {

    private CndResultadoService service;

    @Mock
    private ClienteRepository clienteRepo;
    @Mock
    private CndResultadoRepository resultadoRepository;
    @Mock
    private SituacaoValidationService situacaoValidationService;
    @Mock
    private CndResultadoMapper cndResultadoMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new CndResultadoService(clienteRepo, resultadoRepository, situacaoValidationService, cndResultadoMapper);
    }

    @Test
    void downloadPdf_Success() {
        Long id = 1L;
        CndResultado resultado = new CndResultado();
        resultado.setId(id);
        resultado.setArquivo(Base64.getEncoder().encodeToString("PDF content".getBytes()));
        resultado.setTipoCertidao("Federal");
        resultado.setDataEmissao(LocalDate.of(2025, 6, 24));

        Cliente cliente = new Cliente();
        cliente.setCnpj("12.345.678/0001-99");
        resultado.setCliente(cliente);

        when(resultadoRepository.findById(id)).thenReturn(Optional.of(resultado));

        ResponseEntity<byte[]> response = service.downloadPdf(id);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals("attachment; filename=\"CND_12345678000199_RFB_2025-06-24.pdf\"",
                response.getHeaders().get("Content-Disposition").get(0));
    }

    @Test
    void downloadPdf_Success_Municipal() {
        Long id = 1L;
        CndResultado resultado = new CndResultado();
        resultado.setId(id);
        resultado.setArquivo(Base64.getEncoder().encodeToString("PDF content".getBytes()));
        resultado.setTipoCertidao("Municipal");
        resultado.setDataEmissao(LocalDate.of(2025, 6, 24));

        Cliente cliente = new Cliente();
        cliente.setCnpj("12.345.678/0001-99");
        resultado.setCliente(cliente);

        when(resultadoRepository.findById(id)).thenReturn(Optional.of(resultado));

        ResponseEntity<byte[]> response = service.downloadPdf(id);

        assertEquals("attachment; filename=\"CND_12345678000199_MUN_2025-06-24.pdf\"",
                response.getHeaders().get("Content-Disposition").get(0));
    }
}
