package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.CndResultadoService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoComClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.CndResultadoMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class CndResultadoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CndResultadoRepository cndResultadoRepository;

    @MockBean
    private CndResultadoService cndResultadoService;

    @Autowired
    private CndResultadoMapper cndResultadoMapper;

    @Test
    public void testGetResultadoPorId() throws Exception {
        Empresa empresa = new Empresa();
        empresa.setNomeEmpresa("Empresa Teste");

        Cliente cliente = new Cliente();
        cliente.setId(1);
        cliente.setCnpj("12345678000199");
        cliente.setEmpresa(empresa);

        CndResultado resultado = new CndResultado();
        resultado.setId(1L);
        resultado.setArquivo("YmFzZTY0ZGF0YQ=="); // "base64data"
        resultado.setSituacao("Negativa");
        resultado.setOrgaoEmissor("Receita Federal");
        resultado.setTipoCertidao("Federal");
        resultado.setDataProcessamento(OffsetDateTime.now());
        resultado.setCliente(cliente);

        when(cndResultadoRepository.findById(1L)).thenReturn(Optional.of(resultado));

        mockMvc.perform(get("/resultados/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.arquivo").value("YmFzZTY0ZGF0YQ=="))
                .andExpect(jsonPath("$.orgaoEmissor").value("Receita Federal"))
                .andExpect(jsonPath("$.tipoCertidao").value("Federal"))
                .andExpect(jsonPath("$.clienteCnpj").value("12345678000199"));
    }

    @Test
    public void testListarTodos() throws Exception {
        CndResultadoComClienteDTO dto = new CndResultadoComClienteDTO();
        dto.setId(1L);
        dto.setSituacao("Negativa");
        dto.setHasArquivo(true);

        when(cndResultadoService.listarTodosComCliente()).thenReturn(List.of(dto));

        mockMvc.perform(get("/resultados")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].hasArquivo").value(true));
    }
}
