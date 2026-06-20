package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.CndResultadoService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

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
    private CndResultadoService cndResultadoService;

    @Test
    public void deveRetornarResultadoComArquivo() throws Exception {
        CndResultadoDTO dto = new CndResultadoDTO();
        dto.setId(1L);
        dto.setArquivo("base64content");
        dto.setHasArquivo(true);

        when(cndResultadoService.buscarPorId(1L)).thenReturn(dto);

        mockMvc.perform(get("/resultados/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.arquivo").value("base64content"))
                .andExpect(jsonPath("$.hasArquivo").value(true));
    }
}
